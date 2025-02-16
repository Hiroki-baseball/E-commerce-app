"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PurchaseSuccess = () => {
  const [tacoUrl, setTacoUrl] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  console.log("sessionId:", sessionId);

  useEffect(() => {
    const fetchData = async () => {
      if (sessionId) {
        try {
          console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

          console.log("sessionID", sessionId);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/checkout/success`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );
          const data = await res.json();
          console.log("Response data:", data);
          if (data.error) {
            console.error("Error from API:", data.error);
            return;
          }

          if (data.purchase && data.purchase.tacoId) {
            setTacoUrl(data.purchase.tacoId);
          } else {
            console.error("Purchase data is missing tacoId");
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
    };
    fetchData();
  }, [sessionId]);

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          購入ありがとうございます！
        </h1>
        <p className="text-center text-gray-600">
          ご購入いただいた内容の詳細は、登録されたメールアドレスに送信されます。
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/taco/${tacoUrl}`}
            className="text-green-600 hover:text-green-800 transition duration-300 font-bold"
          >
            購入した記事を読む
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
