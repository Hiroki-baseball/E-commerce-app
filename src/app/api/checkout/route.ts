// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(request:Request) {
//     const {title,price,tacoId,userId} = await request.json();

//     if (!tacoId || !userId) {
//         return NextResponse.json(
//           { error: "tacoId and userId are required." },
//           { status: 400 }
//         );
//       }
      
//     try{
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types:["card"],
//             metadata:{
//                 tacoId: String(tacoId), // 明示的に文字列に変換
//             },
//             client_reference_id:userId,
//             line_items:[
//                 {
//                     price_data:{
//                         currency:"jpy",
//                         product_data:{
//                             name:title,
//                         },
//                         unit_amount:price,
//                     },
//                     quantity:1,
//                 },
//             ],
//             mode:"payment",
//             success_url:`${process.env.NEXT_PUBLIC_BASE_URL}/taco/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url:`${process.env.NEXT_PUBLIC_BASE_URL}`,
//         });

//         return NextResponse.json({checkout_url:session.url});
//     } catch(err:any){
//         return NextResponse.json(err.message);
//     }
// }

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  // リクエストで送られてきた値を取得
  const { title, price, tacoId, userId } = await request.json();
  
  console.log("Received data:", { title, price, tacoId, userId });

  if (!tacoId || !userId) {
    return NextResponse.json(
      { error: "tacoId and userId are required." },
      { status: 400 }
    );
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        tacoId: String(tacoId), // 明示的に文字列に変換
      },
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/taco/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });
    
    // 作成されたセッションの metadata と client_reference_id をログ出力
    console.log("Created session:", session);
    console.log("Session metadata:", session.metadata);
    console.log("Client reference ID:", session.client_reference_id);

    return NextResponse.json({ checkout_url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(err.message);
  }
}
