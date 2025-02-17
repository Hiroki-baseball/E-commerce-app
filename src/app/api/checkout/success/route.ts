import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripeの初期化
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY
);

interface RequestBody {
  sessionId: string;
}

// 購入履歴の保存処理
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.sessionId) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(body.sessionId);

    if (!session.client_reference_id || !session.metadata?.tacoId) {
      console.error("Invalid session data:", {
        client_reference_id: session.client_reference_id,
        metadata: session.metadata,
      });
      return NextResponse.json(
        { error: "Invalid session data. Missing client_reference_id or tacoId." },
        { status: 400 }
      );
    }

    const { client_reference_id: userId, metadata } = session;
    const { tacoId } = metadata;

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, tacoId },
    });

    if (existingPurchase) {
      return NextResponse.json({ purchase: existingPurchase, message: "すでに購入済みです。" });
    }
    
    const purchase = await prisma.purchase.create({
      data: { 
        userId: session.client_reference_id,
        tacoId: session.metadata.tacoId,},
    });

    return NextResponse.json({ purchase });
  } catch (err) {
    console.error("Error processing purchase:", err);

    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing the purchase.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
