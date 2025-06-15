async function handler({ priceId, mode = "subscription", userId }) {
  if (!priceId) {
    return { error: "Price ID is required" };
  }

  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    // Get user data and current subscription
    const [user, existingSubscription] = await sql.transaction([
      sql`
        SELECT email, name 
        FROM auth_users 
        WHERE id = ${userId}
      `,
      sql`
        SELECT stripe_customer_id, stripe_subscription_id
        FROM subscriptions
        WHERE user_id = ${userId}
        AND status = 'active'
      `,
    ]);

    if (!user || !user[0]) {
      return { error: "User not found" };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Get or create Stripe customer
    let customerId = existingSubscription?.[0]?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user[0].email,
        name: user[0].name,
        metadata: {
          userId: userId.toString(),
        },
      });
      customerId = customer.id;
    }

    // Get Stripe price details
    const stripeProduct = await sql`
      SELECT sp.stripe_price_id, spl.price, spl.name
      FROM stripe_products sp
      JOIN subscription_plans spl ON sp.plan_id = spl.id
      WHERE sp.stripe_price_id = ${priceId}
    `;

    if (!stripeProduct || !stripeProduct[0]) {
      return { error: "Invalid price ID" };
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode,
      customer: customerId,
      payment_method_types: ["card"],
      client_reference_id: userId.toString(),
      line_items: [
        {
          price: stripeProduct[0].stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      subscription_data: {
        metadata: {
          userId: userId.toString(),
          planName: stripeProduct[0].name,
        },
        trial_period_days: 14, // Optional: Add trial period
      },
      metadata: {
        userId: userId.toString(),
        planName: stripeProduct[0].name,
      },
    });

    // Start transaction to update database
    await sql.transaction([
      // Update or create subscription record
      sql`
        INSERT INTO subscriptions (
          user_id,
          plan_type,
          status,
          stripe_customer_id,
          stripe_price_id,
          created_at
        ) VALUES (
          ${userId},
          ${stripeProduct[0].name},
          'pending',
          ${customerId},
          ${stripeProduct[0].stripe_price_id},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE
        SET 
          plan_type = ${stripeProduct[0].name},
          status = 'pending',
          stripe_customer_id = ${customerId},
          stripe_price_id = ${stripeProduct[0].stripe_price_id},
          updated_at = CURRENT_TIMESTAMP
      `,
      // Log the transaction attempt
      sql`
        INSERT INTO billing_transactions (
          user_id,
          amount,
          transaction_type,
          status,
          payment_method,
          metadata
        ) VALUES (
          ${userId},
          ${stripeProduct[0].price},
          'subscription_initiated',
          'pending',
          'stripe',
          ${JSON.stringify({
            checkout_session_id: session.id,
            price_id: priceId,
            customer_id: customerId,
          })}
        )
      `,
    ]);

    return {
      url: session.url,
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      error: "Failed to create checkout session",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}