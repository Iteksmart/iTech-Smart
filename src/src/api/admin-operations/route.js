async function handler({ operation, data }) {
  if (!operation) {
    return { error: "Operation type is required" };
  }

  try {
    switch (operation) {
      case "getUsers":
        const users = await sql`
          SELECT id, name, email, subscription_type, status, last_login_at, signup_date 
          FROM auth_users 
          ORDER BY signup_date DESC`;
        return { users };

      case "updateUserStatus":
        const { userId, status } = data;
        await sql`
          UPDATE auth_users 
          SET status = ${status}, 
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${userId}`;
        return { success: true };

      case "getSubscriptions":
        const subscriptions = await sql`
          SELECT s.*, u.email, u.name
          FROM subscriptions s
          JOIN auth_users u ON s.user_id = u.id
          ORDER BY s.created_at DESC`;
        return { subscriptions };

      case "getSecurityLogs":
        const logs = await sql`
          SELECT * FROM security_logs 
          ORDER BY created_at DESC 
          LIMIT 100`;
        return { logs };

      case "updateSettings":
        const { settingKey, settingValue } = data;
        await sql`
          INSERT INTO app_settings (setting_key, setting_value, setting_type)
          VALUES (${settingKey}, ${settingValue}, 'system')
          ON CONFLICT (setting_key) 
          DO UPDATE SET setting_value = ${settingValue}, updated_at = CURRENT_TIMESTAMP`;
        return { success: true };

      case "getMetrics":
        const [growth, engagement, subscription] = await sql.transaction([
          sql`SELECT * FROM user_growth_metrics ORDER BY date DESC LIMIT 30`,
          sql`SELECT * FROM user_engagement_metrics ORDER BY date DESC LIMIT 30`,
          sql`SELECT * FROM subscription_metrics ORDER BY date DESC LIMIT 30`,
        ]);
        return { metrics: { growth, engagement, subscription } };

      case "createNotification":
        const { notificationTitle, message, severity } = data;
        await sql`
          INSERT INTO system_notifications (type, title, message, severity)
          VALUES ('system', ${notificationTitle}, ${message}, ${severity})`;
        return { success: true };

      case "getKnowledgeBase":
        const articles = await sql`
          SELECT * FROM knowledge_base 
          ORDER BY created_at DESC`;
        return { articles };

      case "updateKnowledgeBase":
        const { id, articleTitle, content, category } = data;
        await sql`
          UPDATE knowledge_base 
          SET title = ${articleTitle}, 
              content = ${content}, 
              category = ${category},
              updated_at = CURRENT_TIMESTAMP 
          WHERE id = ${id}`;
        return { success: true };

      default:
        return { error: "Invalid operation type" };
    }
  } catch (error) {
    return { error: "Operation failed" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}