async function handler({ action, userId, status, startDate, endDate }) {
  try {
    switch (action) {
      case "getUsers":
        const users = await sql`
          SELECT * FROM auth_users 
          ORDER BY signup_date DESC
        `;
        return { users };

      case "updateUserStatus":
        if (!userId || !status) {
          return { error: "Missing required fields" };
        }
        await sql`
          UPDATE auth_users 
          SET status = ${status}
          WHERE id = ${userId}
        `;
        return { success: true };

      case "getUserMetrics":
        if (!startDate || !endDate) {
          return { error: "Missing date range" };
        }

        // Get total active users count for rate calculations
        const totalUsers = await sql`
          SELECT COUNT(*) as count 
          FROM auth_users 
          WHERE status = 'active'
        `;

        // Get user growth metrics with total users per day
        const userGrowth = await sql`
          SELECT 
            date,
            new_users as value,
            total_users
          FROM user_growth_metrics
          WHERE date >= ${startDate} AND date <= ${endDate}
          ORDER BY date ASC
        `;

        // Get engagement metrics - active users per day
        const engagement = await sql`
          SELECT 
            date,
            active_users as value
          FROM user_engagement_metrics
          WHERE date >= ${startDate} AND date <= ${endDate}
          ORDER BY date ASC
        `;

        // Get subscription metrics - pro users per day
        const subscriptions = await sql`
          SELECT 
            date,
            pro_users as value
          FROM subscription_metrics
          WHERE date >= ${startDate} AND date <= ${endDate}
          ORDER BY date ASC
        `;

        return {
          metrics: {
            userGrowth,
            engagement,
            subscriptions,
            totalActiveUsers: totalUsers[0].count,
          },
        };

      case "getRealTimeMetrics":
        const now = new Date();
        const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
        const oneHourAgo = new Date(now - 60 * 60 * 1000);

        const realTimeMetrics = await sql`
          SELECT
            COUNT(*) FILTER (WHERE last_activity_at >= ${fiveMinutesAgo}) as active_now,
            COUNT(*) FILTER (WHERE last_activity_at >= ${oneHourAgo}) as active_hour
          FROM auth_users
          WHERE status = 'active'
        `;

        return {
          activeNow: realTimeMetrics[0].active_now,
          activeHour: realTimeMetrics[0].active_hour,
        };

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    console.error("User management error:", error);
    return { error: "Failed to process request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}