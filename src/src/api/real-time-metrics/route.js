async function handler() {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);
    const oneHourAgo = new Date(now - 60 * 60 * 1000);

    const metrics = await sql`
      SELECT
        COUNT(*) FILTER (WHERE last_activity_at >= ${fiveMinutesAgo}) as active_now,
        COUNT(*) FILTER (WHERE last_activity_at >= ${oneHourAgo}) as active_hour,
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE subscription_type = 'pro') as pro_users,
        COUNT(*) FILTER (WHERE signup_date >= ${new Date(
          now.setHours(0, 0, 0, 0)
        )}) as new_today
      FROM auth_users
    `;

    return {
      metrics: metrics[0],
      timestamp: now.toISOString(),
    };
  } catch (error) {
    return {
      error: "Failed to fetch real-time metrics",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}