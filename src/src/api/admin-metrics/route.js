async function handler({ startDate, endDate, metricsType }) {
  try {
    if (metricsType === "realtime") {
      const realtimeMetrics = await sql`
        SELECT * FROM get_real_time_metrics()
      `;

      return {
        success: true,
        data: realtimeMetrics[0] || {
          active_now: 0,
          active_hour: 0,
        },
      };
    }

    // Ensure we have valid dates
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get metrics data
    const metrics = await sql`
      SELECT 
        date::text,
        new_users,
        total_users,
        active_users,
        pro_users
      FROM get_user_metrics(${start}::timestamp, ${end}::timestamp)
      ORDER BY date ASC
    `;

    // Get current stats
    const currentStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE subscription_type = 'pro') as total_pro_users,
        COUNT(*) FILTER (WHERE status = 'active') as total_active_users,
        COUNT(*) as total_users
      FROM auth_users
      WHERE status != 'deleted'
    `;

    // Format the response
    return {
      success: true,
      data: {
        metrics: metrics || [],
        currentStats: currentStats[0] || {
          total_pro_users: 0,
          total_active_users: 0,
          total_users: 0,
        },
      },
    };
  } catch (error) {
    console.error("Admin metrics error:", error);
    return {
      success: false,
      error: "Failed to fetch admin metrics",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}