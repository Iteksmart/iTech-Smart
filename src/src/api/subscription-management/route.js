async function handler({
  action,
  userId,
  planId,
  amount,
  transactionId,
  reason,
}) {
  switch (action) {
    case "subscribe":
      if (!userId || !planId) return { error: "Missing required fields" };

      const [plan] = await sql`
        SELECT * FROM subscription_plans 
        WHERE id = ${planId} AND is_active = true
      `;

      if (!plan) return { error: "Invalid plan" };

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await sql.transaction([
        sql`
          INSERT INTO subscriptions (
            user_id, plan_type, status, 
            current_period_start, current_period_end
          ) VALUES (
            ${userId}, ${plan.name}, 'active', 
            ${startDate}, ${endDate}
          )
        `,
        sql`
          UPDATE auth_users 
          SET subscription_type = ${plan.name},
              subscription_start_date = ${startDate},
              subscription_end_date = ${endDate}
          WHERE id = ${userId}
        `,
        sql`
          INSERT INTO billing_transactions (
            user_id, amount, transaction_type, 
            status, payment_method
          ) VALUES (
            ${userId}, ${plan.price}, 'subscription', 
            'completed', 'card'
          )
        `,
      ]);

      return { success: true, plan: plan.name };

    case "cancel":
      if (!userId) return { error: "Missing user ID" };

      await sql.transaction([
        sql`
          UPDATE subscriptions 
          SET status = 'cancelled' 
          WHERE user_id = ${userId} 
          AND status = 'active'
        `,
        sql`
          UPDATE auth_users 
          SET subscription_type = 'free' 
          WHERE id = ${userId}
        `,
      ]);

      return { success: true };

    case "refund":
      if (!userId || !transactionId || !amount || !reason) {
        return { error: "Missing required fields for refund" };
      }

      await sql`
        INSERT INTO billing_transactions (
          user_id, amount, transaction_type, 
          status, payment_method, metadata
        ) VALUES (
          ${userId}, ${amount}, 'refund', 
          'completed', 'card', 
          ${JSON.stringify({ reason, original_transaction: transactionId })}
        )
      `;

      return { success: true };

    case "getRevenue":
      const revenue = await sql`
        SELECT 
          DATE_TRUNC('month', transaction_date) as month,
          SUM(CASE 
            WHEN transaction_type = 'subscription' THEN amount 
            WHEN transaction_type = 'refund' THEN -amount 
            ELSE 0 
          END) as revenue
        FROM billing_transactions
        GROUP BY DATE_TRUNC('month', transaction_date)
        ORDER BY month DESC
      `;

      return { revenue };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}