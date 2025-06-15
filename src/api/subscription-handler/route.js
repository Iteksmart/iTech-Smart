async function handler({
  userId,
  priceId,
  mode = "subscription",
  successUrl,
  cancelUrl,
}) {
  if (!userId || !priceId) {
    return { error: "Missing required parameters" };
  }

  try {
    const user = await sql`
      SELECT email, name 
      FROM auth_users 
      WHERE id = ${userId}
    `;

    if (!user || !user[0]) {
      return { error: "User not found" };
    }

    if (mode === "subscription") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        customer_email: user[0].email,
        client_reference_id: userId.toString(),
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || process.env.STRIPE_SUCCESS_URL,
        cancel_url: cancelUrl || process.env.STRIPE_CANCEL_URL,
        metadata: {
          userId: userId.toString(),
        },
      });

      await sql`
        INSERT INTO billing_transactions (
          user_id, 
          amount, 
          transaction_type, 
          status, 
          payment_method,
          metadata
        ) VALUES (
          ${userId},
          0,
          'subscription_initiated',
          'pending',
          'stripe',
          ${JSON.stringify({
            session_id: session.id,
            price_id: priceId,
          })}
        )
      `;

      return {
        sessionId: session.id,
        sessionUrl: session.url,
      };
    }

    if (mode === "retrieve") {
      const transactions = await sql`
        SELECT * FROM billing_transactions 
        WHERE user_id = ${userId} 
        ORDER BY transaction_date DESC 
        LIMIT 1
      `;

      if (!transactions || !transactions[0]) {
        return { error: "No transactions found" };
      }

      return {
        transaction: transactions[0],
      };
    }

    return { error: "Invalid mode specified" };
  } catch (error) {
    return {
      error: "Failed to process subscription",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}