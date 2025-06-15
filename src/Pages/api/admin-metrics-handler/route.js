async function handler({ startDate, endDate, metricsType }) {
  try {
    // Handle real-time metrics request
    if (metricsType === "realtime") {
      const realtimeMetrics = await sql`
        SELECT * FROM get_real_time_metrics()
      `;

      return {
        success: true,
        data: {
          active_now: realtimeMetrics[0]?.active_now || 0,
          active_hour: realtimeMetrics[0]?.active_hour || 0,
        },
      };
    }

    // Ensure we have valid dates
    if (!startDate || !endDate) {
      const now = new Date();
      endDate = now.toISOString();
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
    }

    // Get current stats
    const currentStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as total_active_users,
        COUNT(*) FILTER (WHERE subscription_type = 'pro') as total_pro_users,
        COUNT(*) as total_users
      FROM auth_users
    `;

    // Get metrics for the date range
    const metrics = await sql`
      WITH dates AS (
        SELECT generate_series(
          ${startDate}::date,
          ${endDate}::date,
          '1 day'::interval
        )::date AS metric_date
      ),
      daily_stats AS (
        SELECT 
          date_trunc('day', signup_date)::date as stat_date,
          COUNT(*) as new_users,
          COUNT(*) FILTER (WHERE status = 'active') as active_users,
          COUNT(*) FILTER (WHERE subscription_type = 'pro') as pro_users
        FROM auth_users
        WHERE signup_date >= ${startDate}::timestamp
          AND signup_date <= ${endDate}::timestamp
        GROUP BY stat_date
      )
      SELECT 
        d.metric_date as date,
        COALESCE(s.new_users, 0) as new_users,
        COALESCE(s.active_users, 0) as active_users,
        COALESCE(s.pro_users, 0) as pro_users,
        (
          SELECT COUNT(*)
          FROM auth_users
          WHERE signup_date <= d.metric_date
        ) as total_users
      FROM dates d
      LEFT JOIN daily_stats s ON d.metric_date = s.stat_date
      ORDER BY d.metric_date
    `;

    return {
      success: true,
      data: {
        metrics: metrics || [],
        currentStats: currentStats[0] || {
          total_active_users: 0,
          total_pro_users: 0,
          total_users: 0,
        },
      },
    };
  } catch (error) {
    console.error("Error in admin-metrics handler:", error);
    return {
      success: false,
      error: "Failed to fetch metrics",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}