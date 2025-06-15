async function handler({ description }) {
  try {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Authentication required" };
    }

    const subscription = await sql`
      SELECT plan_type, status, current_period_end 
      FROM subscriptions 
      WHERE user_id = ${session.user.id}
      AND status = 'active'
      AND current_period_end > NOW()
      ORDER BY current_period_end DESC
      LIMIT 1
    `;

    const userPlan = subscription?.[0]?.plan_type || "free";

    if (userPlan === "free") {
      const today = new Date().toISOString().split("T")[0];

      const dailyUsage = await sql`
        SELECT COUNT(*) as count
        FROM chat_history
        WHERE user_id = ${session.user.id}
        AND DATE(created_at) = ${today}
      `;

      if (dailyUsage[0].count >= 5) {
        return {
          error:
            "Daily limit reached for free tier. Please upgrade for unlimited access.",
        };
      }
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an IT expert. Provide relevant PowerShell, Bash, or CMD commands to diagnose and fix IT issues. Format response as JSON with 'commands' array containing objects with 'command' and 'explanation' fields.",
          },
          {
            role: "user",
            content: description,
          },
        ],
      }),
    });

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    await sql`
      INSERT INTO chat_history (user_id, message, response)
      VALUES (
        ${session.user.id},
        ${description},
        ${JSON.stringify(suggestions)}
      )
    `;

    if (userPlan === "free") {
      return {
        commands: suggestions.commands.slice(0, 3),
        limited: true,
      };
    }

    return {
      commands: suggestions.commands,
      limited: false,
    };
  } catch (error) {
    return { error: "Failed to generate script suggestions" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}