async function handler({ body, headers }) {
  const stripeSignature = headers["stripe-signature"];

  if (!stripeSignature) {
    return {
      statusCode: 400,
      body: { error: "Missing stripe signature" },
    };
  }

  // Store webhook event
  const event = await sql`
    INSERT INTO stripe_webhook_events (
      stripe_event_id, 
      event_type, 
      event_data,
      created_at
    ) VALUES (
      ${body.id},
      ${body.type},
      ${body},
      NOW()
    )
    RETURNING id
  `;

  // Handle different event types
  switch (body.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = body.data.object;

      await sql`
        UPDATE subscriptions 
        SET 
          status = ${subscription.status},
          current_period_start = to_timestamp(${subscription.current_period_start}),
          current_period_end = to_timestamp(${subscription.current_period_end}),
          stripe_price_id = ${subscription.items.data[0].price.id},
          updated_at = NOW()
        WHERE stripe_subscription_id = ${subscription.id}
      `;

      await sql`
        UPDATE auth_users
        SET subscription_type = CASE 
          WHEN ${subscription.status} = 'active' THEN 'pro'
          ELSE 'free'
        END,
        subscription_start_date = to_timestamp(${subscription.current_period_start}),
        subscription_end_date = to_timestamp(${subscription.current_period_end})
        WHERE id = (
          SELECT user_id 
          FROM subscriptions 
          WHERE stripe_subscription_id = ${subscription.id}
        )
      `;
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = body.data.object;

      await sql.transaction([
        sql`
          UPDATE subscriptions
          SET 
            status = 'cancelled',
            updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `,
        sql`
          UPDATE auth_users
          SET 
            subscription_type = 'free',
            subscription_end_date = to_timestamp(${subscription.current_period_end})
          WHERE id = (
            SELECT user_id 
            FROM subscriptions 
            WHERE stripe_subscription_id = ${subscription.id}
          )
        `,
      ]);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = body.data.object;

      await sql`
        INSERT INTO billing_transactions (
          user_id,
          amount,
          transaction_type,
          status,
          payment_method,
          metadata
        )
        SELECT 
          user_id,
          ${invoice.amount_paid / 100.0},
          'subscription_payment',
          'succeeded',
          ${invoice.payment_method_types[0]},
          ${JSON.stringify({
            invoice_id: invoice.id,
            subscription_id: invoice.subscription,
          })}
        FROM subscriptions
        WHERE stripe_subscription_id = ${invoice.subscription}
      `;
      break;
    }

    case "invoice.payment_failed": {
      const invoice = body.data.object;

      await sql`
        INSERT INTO billing_transactions (
          user_id,
          amount,
          transaction_type,
          status,
          payment_method,
          metadata
        )
        SELECT 
          user_id,
          ${invoice.amount_due / 100.0},
          'subscription_payment',
          'failed',
          ${invoice.payment_method_types[0]},
          ${JSON.stringify({
            invoice_id: invoice.id,
            subscription_id: invoice.subscription,
            failure_reason: invoice.last_payment_error?.message,
          })}
        FROM subscriptions
        WHERE stripe_subscription_id = ${invoice.subscription}
      `;
      break;
    }
  }

  // Mark webhook as processed
  await sql`
    UPDATE stripe_webhook_events
    SET processed_at = NOW()
    WHERE id = ${event.id}
  `;

  return {
    statusCode: 200,
    body: { received: true },
  };
}
export async function POST(request) {
  return handler(await request.json());
}