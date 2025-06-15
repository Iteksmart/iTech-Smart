async function handler({ chatHistory, commands, title }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Authentication required" };
  }

  // Check subscription status
  const subscription = await sql`
    SELECT plan_type, status 
    FROM subscriptions 
    WHERE user_id = ${session.user.id}
    AND status = 'active'
    AND current_period_end > NOW()
    LIMIT 1
  `;

  if (
    !subscription?.length ||
    !["pro", "team"].includes(subscription[0].plan_type)
  ) {
    return { error: "Pro or Team subscription required" };
  }

  if (!chatHistory || !commands || !title) {
    return { error: "Missing required fields" };
  }

  // Format content for ticket generation
  const prompt = `
    Chat History: ${chatHistory}
    Commands Used: ${commands}
    
    Generate a professional IT ticket note including:
    1. Problem description
    2. Troubleshooting steps taken
    3. Resolution and outcome
    Format in clear, technical language suitable for documentation.
  `;

  try {
    // Call ChatGPT API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const generatedNote = data.choices[0].message.content;

    // Store ticket in database
    const ticket = await sql`
      INSERT INTO tickets (
        user_id,
        title,
        description,
        status,
        priority,
        created_at,
        updated_at
      ) VALUES (
        ${session.user.id},
        ${title},
        ${generatedNote},
        'open',
        'medium',
        NOW(),
        NOW()
      ) RETURNING id, title, description, status, created_at
    `;

    return {
      success: true,
      ticket: ticket[0],
    };
  } catch (error) {
    return { error: "Failed to generate ticket" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}