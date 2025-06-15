async function handler({ name, email, subject, message }) {
  if (!name || !email || !subject || !message) {
    return { error: "All fields are required" };
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return { error: "Invalid email format" };
  }

  try {
    // Store contact form submission
    const [submission] = await sql`
      INSERT INTO contact_submissions (
        name,
        email,
        subject,
        message,
        created_at
      ) VALUES (
        ${name},
        ${email},
        ${subject},
        ${message},
        NOW()
      )
      RETURNING id
    `;

    // Get admin emails
    const adminUsers = await sql`
      SELECT DISTINCT u.email 
      FROM auth_users u
      JOIN auth_accounts a ON u.id = a."userId"
      WHERE a.type = 'admin'
    `;

    // Send notification to each admin
    const adminEmails = adminUsers.map((user) => user.email);

    if (adminEmails.length > 0) {
      const emailContent = `
        New Contact Form Submission:
        From: ${name} (${email})
        Subject: ${subject}
        Message: ${message}
        
        View submission in admin dashboard: https://aiitassistant.com/admin/contact/${submission.id}
      `;

      await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: adminEmails.map((email) => ({ email })),
            },
          ],
          from: { email: "noreply@aiitassistant.com" },
          subject: "New Contact Form Submission",
          content: [{ type: "text/plain", value: emailContent }],
        }),
      });
    }

    return {
      success: true,
      message: "Contact form submitted successfully",
      id: submission.id,
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "Failed to process contact form submission" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}