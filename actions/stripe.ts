"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

const settingsUrl = absoluteUrl("/dashboard")

export async function createStripeSession() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If user already has a Stripe customer ID and an active subscription, take them to billing portal
  if (user.stripeCustomerId && user.stripeSubscriptionId && user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd.getTime() > Date.now()) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: settingsUrl,
    });

    return { url: stripeSession.url };
  }

  // Otherwise, create checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: settingsUrl,
    cancel_url: settingsUrl,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: "Nova Pro",
            description: "Unlimited AI tools for your career",
          },
          unit_amount: 999,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
    },
  });

  return { url: stripeSession.url };
}
