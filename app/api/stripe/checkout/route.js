import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const tier = body.tier || "FAMILY_SHIELD";

    const priceId = process.env.STRIPE_PRICE_FAMILY_SHIELD;
    if (!stripe || !priceId) return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/onboarding/start?payment=success`,
      cancel_url: `${baseUrl}/billing?canceled=1`,
      client_reference_id: userId,
      metadata: { tier, clerk_user_id: userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err?.message || "Checkout failed" }, { status: 500 });
  }
}
