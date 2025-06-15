async function handler() {
  try {
    const plans = await sql`
      SELECT 
        sp.id,
        sp.name,
        sp.description,
        sp.price,
        sp.billing_interval,
        sp.features,
        sp.is_active,
        sp.trial_period_days,
        sp.usage_limits,
        stp.stripe_price_id
      FROM subscription_plans sp
      LEFT JOIN stripe_products stp ON sp.id = stp.plan_id
      WHERE sp.is_active = true
      ORDER BY sp.sort_order ASC, sp.price ASC
    `;

    return {
      success: true,
      plans,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch subscription plans",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}