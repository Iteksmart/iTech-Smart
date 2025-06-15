async function handler({ token }) {
  if (!token) {
    return { error: "Verification token is required" };
  }

  try {
    // Get token record and verify it exists and hasn't expired
    const tokenRecords = await sql`
      SELECT * FROM auth_verification_token 
      WHERE token = ${token}
      AND expires > NOW()
      LIMIT 1
    `;

    if (!tokenRecords.length) {
      return { error: "Invalid or expired verification token" };
    }

    const tokenRecord = tokenRecords[0];

    // Update user email verification status and remove token in transaction
    await sql.transaction([
      sql`
        UPDATE auth_users 
        SET "emailVerified" = NOW()
        WHERE email = ${tokenRecord.identifier}
      `,
      sql`
        DELETE FROM auth_verification_token 
        WHERE token = ${token}
      `,
    ]);

    return { success: true };
  } catch (error) {
    return { error: "Failed to verify email" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}