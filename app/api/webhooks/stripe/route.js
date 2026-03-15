import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function mapTierFromMetadata(tier) {
  const t = (tier || "").toUpperCase();
  if (t === "ACCESS") return "ACCESS";
  if (t === "FAMILY_SHIELD" || t === "SHIELD") return "FAMILY_SHIELD";
  if (t === "ELDER_ADVOCACY" || t === "ADVOCACY") return "ELDER_ADVOCACY";
  return "FAMILY_SHIELD";
}

export async function POST(request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clerkUserId = session.client_reference_id || session.metadata?.clerk_user_id;
    const tier = mapTierFromMetadata(session.metadata?.tier);

    if (clerkUserId) {
      const supabase = createAdminClient();
      if (supabase) {
        const payload = {
          clerk_user_id: clerkUserId,
          subscription_status: "active",
          subscription_tier: tier,
          onboarding_step: "role-selection",
          role: "OPTIMIZER",
          onboarding_complete: false,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "clerk_user_id" });
        if (error) console.error("Webhook: failed to upsert profile", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
