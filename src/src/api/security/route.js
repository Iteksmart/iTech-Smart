async function handler({
  action,
  userId,
  adminId,
  eventType,
  eventData,
  ipAddress,
  userAgent,
}) {
  switch (action) {
    case "logSecurityEvent":
      return await sql`
        INSERT INTO security_logs 
        (event_type, user_id, admin_id, ip_address, user_agent, event_data)
        VALUES 
        (${eventType}, ${userId}, ${adminId}, ${ipAddress}, ${userAgent}, ${eventData})
        RETURNING id`;

    case "getSecurityLogs":
      return await sql`
        SELECT * FROM security_logs 
        ORDER BY created_at DESC 
        LIMIT 100`;

    case "getAdminRoles":
      return await sql`
        SELECT r.* FROM admin_roles r
        JOIN admin_account_roles ar ON r.id = ar.role_id
        WHERE ar.admin_id = ${adminId}`;

    case "checkAdminPermissions":
      const roles = await sql`
        SELECT r.permissions FROM admin_roles r
        JOIN admin_account_roles ar ON r.id = ar.role_id
        WHERE ar.admin_id = ${adminId}`;

      return {
        hasPermissions: roles.length > 0,
        permissions: roles.map((r) => r.permissions),
      };

    case "getFailedLoginAttempts":
      return await sql`
        SELECT COUNT(*) as attempts 
        FROM security_logs
        WHERE event_type = 'failed_login'
        AND user_id = ${userId}
        AND created_at > NOW() - INTERVAL '24 hours'`;

    default:
      return null;
  }
}
export async function POST(request) {
  return handler(await request.json());
}