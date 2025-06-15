async function handler({ email, password }) {
  try {
    const session = getSession();

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Check if user exists and has admin account
    const adminUser = await sql`
      SELECT a.*, acc.password 
      FROM auth_users a
      JOIN auth_accounts acc ON a.id = acc."userId"
      WHERE a.email = ${email} 
      AND acc.type = 'admin'
      LIMIT 1
    `;

    if (!adminUser?.length) {
      return { error: "Invalid admin credentials" };
    }

    const user = adminUser[0];

    if (user.password !== password) {
      return { error: "Invalid admin credentials" };
    }

    // Check admin subscription status
    const subscription = await sql`
      SELECT * FROM subscriptions 
      WHERE user_id = ${user.id}
      AND plan_type = 'admin'
      AND status = 'active'
      AND current_period_end > NOW()
      LIMIT 1
    `;

    if (!subscription?.length) {
      return { error: "No active admin subscription" };
    }

    // Create new admin session
    const sessionToken = Math.random().toString(36).substring(2);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    await sql`
      INSERT INTO auth_sessions ("userId", "sessionToken", expires)
      VALUES (${user.id}, ${sessionToken}, ${expires})
    `;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        sessionToken,
        expires,
      },
    };
  } catch (error) {
    return { error: "Authentication failed" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}