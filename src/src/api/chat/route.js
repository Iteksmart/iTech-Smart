async function handler({ message }) {
  if (!message) {
    return { error: "Message is required" };
  }

  try {
    // Get the current user's ID from the session
    const { userId } = await getSession();
    if (!userId) {
      return { error: "Authentication required" };
    }

    // Get user's subscription and message count
    const users = await sql`
      SELECT 
        u.id,
        u.daily_message_count,
        u.last_message_date,
        COALESCE(s.plan_type, 'free') as subscription_type
      FROM auth_users u
      LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE u.id = ${userId}
    `;

    if (!users.length) {
      return { error: "User not found" };
    }

    const user = users[0];

    // Reset count if it's a new day
    const today = new Date().toISOString().split("T")[0];
    const lastMessageDate = user.last_message_date
      ? user.last_message_date.toISOString().split("T")[0]
      : null;

    if (!lastMessageDate || lastMessageDate < today) {
      await sql`
        UPDATE auth_users 
        SET daily_message_count = 0,
            last_message_date = CURRENT_DATE
        WHERE id = ${userId}
      `;
      user.daily_message_count = 0;
    }

    // Check user's message limit
    const messageLimit =
      user.subscription_type === "pro"
        ? 100
        : user.subscription_type === "team"
        ? 500
        : 10;

    if (user.daily_message_count >= messageLimit) {
      return {
        error: "Daily chat limit reached",
        remaining: 0,
      };
    }

    // Make the ChatGPT request first before incrementing count
    const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are an IT support assistant helping users with technical issues. Provide clear, step-by-step solutions and explanations. For PowerShell commands, include practical examples.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`ChatGPT API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error("No result from ChatGPT API");
    }

    // Only increment count and store history if we got a successful response
    await sql`
      UPDATE auth_users 
      SET daily_message_count = daily_message_count + 1
      WHERE id = ${userId}
    `;

    // Store chat history
    await sql`
      INSERT INTO chat_history (user_id, message, response)
      VALUES (${userId}, ${message}, ${data.result})
    `;

    // Get remaining messages after increment
    const remaining = messageLimit - (user.daily_message_count + 1);

    return {
      response: data.result,
      remaining,
    };
  } catch (error) {
    console.error("Chat error:", error);
    return {
      error: "Failed to process your message. Please try again.",
      remaining: null,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}