async function handler({ email }) {
  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const users = await sql`
      SELECT id, email 
      FROM auth_users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return { success: true }; // Return success even if email not found for security
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await sql`
      INSERT INTO auth_verification_token 
      (identifier, token, expires)
      VALUES (${email}, ${token}, ${expires})
    `;

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/reset-password?token=${token}`;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
          },
        ],
        from: { email: "noreply@aiitassistant.com" },
        subject: "Reset Your Password",
        content: [
          {
            type: "text/plain",
            value: `Click this link to reset your password: ${resetUrl}\n\nThis link will expire in 24 hours.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Failed to process password reset request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}