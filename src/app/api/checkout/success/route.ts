// import prisma from "@/app/lib/prisma";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// //購入履歴の保存
// export async function POST(request:Request){
//     const {sessionId} = await request.json();

//     try{
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         const existingPurchase = await prisma.purchase.findFirst({
//             where:{
//                 userId:session.client_reference_id!,
//                 bookId:session.metadata?.bookId!,
//             },
//         });

//         if(!existingPurchase){
//             const purchase = await prisma.purchase.create({
//                 data:{
//                     userId:session.client_reference_id!,
//                     bookId: session.metadata?.bookId!,
//                 },
//             });
//             return NextResponse.json({purchase});
//         }else{
//             return NextResponse.json({message:"すでに購入済みです。"});
//         }
//     }catch (err){
//         return NextResponse.json(err);
//     }
// }

import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripeの初期化
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

interface RequestBody {
  sessionId: string;
}

// 購入履歴の保存
export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const { sessionId } = (await request.json()) as RequestBody;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    // Stripeセッションの取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.client_reference_id || !session.metadata?.bookId) {
      return NextResponse.json(
        { error: "Invalid session data." },
        { status: 400 }
      );
    }

    // 購入済みか確認
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id,
        bookId: session.metadata.bookId,
      },
    });

    // 新規購入処理
    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id,
          bookId: session.metadata.bookId,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      return NextResponse.json({ message: "すでに購入済みです。" });
    }
  } catch (err) {
    console.error("Error processing purchase:", err);

    // エラーレスポンス
    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
