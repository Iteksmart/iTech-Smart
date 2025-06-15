async function handler({ userId }) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    const [userDetails, activities] = await sql.transaction([
      sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.subscription_type,
          u.status,
          u.last_login_at,
          u.signup_date,
          u.total_logins,
          u.last_activity_at
        FROM auth_users u
        WHERE u.id = ${userId}
      `,
      sql`
        SELECT 
          activity_type,
          activity_details,
          created_at
        FROM user_activities
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 10
      `,
    ]);

    if (!userDetails || userDetails.length === 0) {
      return { error: "User not found" };
    }

    return {
      user: userDetails[0],
      recentActivities: activities,
    };
  } catch (error) {
    return { error: "Failed to fetch user details" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}