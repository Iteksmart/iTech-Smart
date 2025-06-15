async function handler({
  action,
  userId,
  adminId,
  eventType,
  eventData,
  roleId,
  username,
  password,
  roleName,
  permissions,
}) {
  switch (action) {
    case "createSecurityLog":
      return await sql`
        INSERT INTO security_logs (event_type, user_id, admin_id, event_data)
        VALUES (${eventType}, ${userId}, ${adminId}, ${eventData})
        RETURNING *
      `;

    case "getSecurityLogs":
      return await sql`
        SELECT * FROM security_logs 
        ORDER BY created_at DESC
      `;

    case "createAdminAccount":
      return await sql.transaction(async (sql) => {
        const admin = await sql`
          INSERT INTO admin_accounts (username, password_hash)
          VALUES (${username}, ${password})
          RETURNING *
        `;

        await sql`
          INSERT INTO security_logs (event_type, admin_id, event_data)
          VALUES ('admin_account_created', ${admin.id}, ${JSON.stringify({
          username,
        })})
        `;

        return admin;
      });

    case "createAdminRole":
      return await sql.transaction(async (sql) => {
        const role = await sql`
          INSERT INTO admin_roles (role_name, permissions)
          VALUES (${roleName}, ${permissions})
          RETURNING *
        `;

        await sql`
          INSERT INTO security_logs (event_type, event_data)
          VALUES ('admin_role_created', ${JSON.stringify({
            roleName,
            permissions,
          })})
        `;

        return role;
      });

    case "assignRoleToAdmin":
      return await sql.transaction(async (sql) => {
        await sql`
          INSERT INTO admin_account_roles (admin_id, role_id)
          VALUES (${adminId}, ${roleId})
        `;

        await sql`
          INSERT INTO security_logs (event_type, admin_id, event_data)
          VALUES ('role_assigned', ${adminId}, ${JSON.stringify({ roleId })})
        `;

        return { success: true };
      });

    case "getAdminRoles":
      return await sql`
        SELECT * FROM admin_roles
      `;

    case "getAdminAccounts":
      return await sql`
        SELECT a.*, array_agg(r.role_name) as roles
        FROM admin_accounts a
        LEFT JOIN admin_account_roles ar ON a.id = ar.admin_id
        LEFT JOIN admin_roles r ON ar.role_id = r.id
        GROUP BY a.id
      `;

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}