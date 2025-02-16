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
    // リクエストボディを取得し、型をチェック
    const body = (await request.json()) as RequestBody;
    console.log("Received request body:", body);

    if (!body.sessionId) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    // Stripeセッションの取得
    const session = await stripe.checkout.sessions.retrieve(body.sessionId);
    console.log("Session data:", JSON.stringify(session, null, 2));

    // 必須データのバリデーション
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

    // Prismaで購入履歴を確認
    const { client_reference_id: userId, metadata } = session;
    const { tacoId } = metadata;
    console.log("Valid session values:", { userId, tacoId });

    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, tacoId },
      // where: {
      //   userId:session.client_reference_id,
      //   tacoId:session.metadata.tacoId,
      // },
    });

    if (existingPurchase) {
      console.log("Existing purchase found:", existingPurchase);
      return NextResponse.json({ purchase: existingPurchase, message: "すでに購入済みです。" });
    }
    

    // 新規購入を保存
    const purchase = await prisma.purchase.create({
      data: { 
        userId: session.client_reference_id,
        tacoId: session.metadata.tacoId,},
    });
    console.log("New purchase created:", purchase);

    return NextResponse.json({ purchase });
  } catch (err) {
    console.error("Error processing purchase:", err);

    // エラーレスポンスを詳細に
    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing the purchase.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
