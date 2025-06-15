async function handler({ token, password }) {
  if (!token || !password) {
    return { error: "Token and password are required" };
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
      return { error: "Invalid or expired reset token" };
    }

    const tokenRecord = tokenRecords[0];

    // Get user account associated with token identifier (email)
    const accounts = await sql`
      SELECT * FROM auth_accounts 
      WHERE "userId" IN (
        SELECT id FROM auth_users 
        WHERE email = ${tokenRecord.identifier}
      )
      LIMIT 1
    `;

    if (!accounts.length) {
      return { error: "User account not found" };
    }

    // Update password and delete used token in a transaction
    await sql.transaction([
      sql`
        UPDATE auth_accounts 
        SET password = ${password}
        WHERE id = ${accounts[0].id}
      `,
      sql`
        DELETE FROM auth_verification_token 
        WHERE token = ${token}
      `,
    ]);

    return { success: true };
  } catch (error) {
    return { error: "Failed to reset password" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}