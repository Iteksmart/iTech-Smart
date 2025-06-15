async function handler({ action, userId, planType, stripeEvent }) {
  const session = getSession();

  if (!session && !stripeEvent) {
    return { error: "Unauthorized" };
  }

  try {
    switch (action) {
      case "create": {
        // For new subscriptions, if no planType is specified, default to 'free'
        const subscriptionPlanType = planType || "free";

        if (!userId) {
          return { error: "Missing required fields" };
        }

        const existingSubscription = await sql`
          SELECT * FROM subscriptions 
          WHERE user_id = ${userId} 
          AND status = 'active'
          LIMIT 1
        `;

        if (existingSubscription.length > 0) {
          return { error: "Active subscription already exists" };
        }

        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        const [subscription] = await sql`
          INSERT INTO subscriptions (
            user_id,
            plan_type,
            status,
            current_period_start,
            current_period_end,
            created_at,
            updated_at
          ) VALUES (
            ${userId},
            ${subscriptionPlanType},
            'active',
            NOW(),
            ${periodEnd},
            NOW(),
            NOW()
          )
          RETURNING *
        `;

        return { success: true, subscription };
      }

      case "update": {
        if (!userId || !planType) {
          return { error: "Missing required fields" };
        }

        const [subscription] = await sql`
          UPDATE subscriptions
          SET 
            plan_type = ${planType},
            updated_at = NOW()
          WHERE user_id = ${userId}
          AND status = 'active'
          RETURNING *
        `;

        return { success: true, subscription };
      }

      case "cancel": {
        if (!userId) {
          return { error: "Missing required fields" };
        }

        const [subscription] = await sql`
          UPDATE subscriptions
          SET 
            status = 'cancelled',
            updated_at = NOW()
          WHERE user_id = ${userId}
          AND status = 'active'
          RETURNING *
        `;

        return { success: true, subscription };
      }

      case "status": {
        if (!userId) {
          return { error: "Missing required fields" };
        }

        const subscriptions = await sql`
          SELECT * FROM subscriptions
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
          LIMIT 1
        `;

        return {
          success: true,
          subscription: subscriptions[0] || null,
        };
      }

      case "webhook": {
        if (!stripeEvent) {
          return { error: "Invalid webhook event" };
        }

        const { type, data } = stripeEvent;

        switch (type) {
          case "customer.subscription.updated": {
            const { subscription } = data.object;
            const [updated] = await sql`
              UPDATE subscriptions
              SET 
                status = ${subscription.status},
                current_period_end = ${new Date(
                  subscription.current_period_end * 1000
                )},
                updated_at = NOW()
              WHERE user_id = ${subscription.metadata.userId}
              RETURNING *
            `;

            return { success: true, subscription: updated };
          }

          case "customer.subscription.deleted": {
            const { subscription } = data.object;
            const [cancelled] = await sql`
              UPDATE subscriptions
              SET 
                status = 'cancelled',
                updated_at = NOW()
              WHERE user_id = ${subscription.metadata.userId}
              RETURNING *
            `;

            return { success: true, subscription: cancelled };
          }

          default:
            return { error: "Unsupported webhook event" };
        }
      }

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    console.error("Subscription handler error:", error);
    return { error: "Failed to process subscription request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}