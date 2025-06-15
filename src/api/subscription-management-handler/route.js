async function handler({ action, planData, userId, planId }) {
  switch (action) {
    case "createPlan":
      if (!planData?.name || !planData?.price || !planData?.billing_interval) {
        return { error: "Missing required plan data" };
      }

      const newPlan = await sql`
        INSERT INTO subscription_plans (
          name, description, price, billing_interval, features, is_active
        ) VALUES (
          ${planData.name},
          ${planData.description || null},
          ${planData.price},
          ${planData.billing_interval},
          ${planData.features || null},
          ${true}
        ) RETURNING *`;
      return { plan: newPlan[0] };

    case "updatePlan":
      if (!planId) {
        return { error: "Plan ID is required" };
      }

      const setValues = [];
      const queryParams = [];
      let paramCount = 1;

      if (planData.name) {
        setValues.push(`name = $${paramCount}`);
        queryParams.push(planData.name);
        paramCount++;
      }
      if (planData.description !== undefined) {
        setValues.push(`description = $${paramCount}`);
        queryParams.push(planData.description);
        paramCount++;
      }
      if (planData.price) {
        setValues.push(`price = $${paramCount}`);
        queryParams.push(planData.price);
        paramCount++;
      }
      if (planData.billing_interval) {
        setValues.push(`billing_interval = $${paramCount}`);
        queryParams.push(planData.billing_interval);
        paramCount++;
      }
      if (planData.features) {
        setValues.push(`features = $${paramCount}`);
        queryParams.push(planData.features);
        paramCount++;
      }
      if (planData.is_active !== undefined) {
        setValues.push(`is_active = $${paramCount}`);
        queryParams.push(planData.is_active);
        paramCount++;
      }

      setValues.push(`updated_at = CURRENT_TIMESTAMP`);
      queryParams.push(planId);

      const updateQuery = `
        UPDATE subscription_plans 
        SET ${setValues.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *`;

      const updatedPlan = await sql(updateQuery, queryParams);
      return { plan: updatedPlan[0] };

    case "deletePlan":
      if (!planId) {
        return { error: "Plan ID is required" };
      }

      const deletedPlan = await sql`
        DELETE FROM subscription_plans 
        WHERE id = ${planId} 
        RETURNING *`;
      return { plan: deletedPlan[0] };

    case "subscribeToPlan":
      if (!userId || !planId) {
        return { error: "User ID and Plan ID are required" };
      }

      const [plan, existingSubscription] = await sql.transaction([
        sql`SELECT * FROM subscription_plans WHERE id = ${planId}`,
        sql`SELECT * FROM subscriptions WHERE user_id = ${userId} AND status = 'active'`,
      ]);

      if (!plan[0]) {
        return { error: "Plan not found" };
      }

      if (existingSubscription[0]) {
        await sql`
          UPDATE subscriptions 
          SET status = 'cancelled' 
          WHERE user_id = ${userId} AND status = 'active'`;
      }

      const newSubscription = await sql`
        INSERT INTO subscriptions (
          user_id, plan_type, status, current_period_start, current_period_end
        ) VALUES (
          ${userId},
          ${plan[0].name},
          'active',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP + INTERVAL '1 month'
        ) RETURNING *`;

      await sql`
        UPDATE auth_users 
        SET subscription_type = ${plan[0].name},
            subscription_start_date = CURRENT_TIMESTAMP,
            subscription_end_date = CURRENT_TIMESTAMP + INTERVAL '1 month'
        WHERE id = ${userId}`;

      return { subscription: newSubscription[0] };

    case "cancelSubscription":
      if (!userId) {
        return { error: "User ID is required" };
      }

      const cancelledSubscription = await sql.transaction(async (txn) => {
        const cancelled = await txn`
          UPDATE subscriptions 
          SET status = 'cancelled',
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${userId} 
          AND status = 'active' 
          RETURNING *`;

        await txn`
          UPDATE auth_users 
          SET subscription_type = 'free',
              subscription_end_date = CURRENT_TIMESTAMP
          WHERE id = ${userId}`;

        return cancelled;
      });

      return { subscription: cancelledSubscription[0] };

    default:
      return { error: "Invalid action" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}