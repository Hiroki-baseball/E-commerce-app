"use client";

import Image from "next/image";
import { TacoType, User } from "../types/type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";

type Props = {
  taco: TacoType;
  isPurchased: boolean;
  user: User;
};

const Taco = ({ taco, isPurchased, user }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const startCheckout = async () => {
    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: taco.title,
            price: taco.price,
            userId: user?.id,
            tacoId: taco.id,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData?.checkout_url) {
        router.push(responseData.checkout_url);
      } else {
        console.error("Invalid checkout URL");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const handlePurchaseClick = () => {
    if (isPurchased) {
      alert("そのレシピは購入済みです");
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, [showModal]);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePurchaseComfirm = () => {
    if (!user) {
      setShowModal(false);
      router.push("/api/auth/signin");
    } else {
      startCheckout();
    }
  };

  return (
    <main className="flex justify-center items-start bg-yellow-50 py-6 min-h-screen">
      <div className="max-w-5xl w-full px-4">
        <Suspense fallback={<Loading />}>
          <div className="flex flex-col items-center m-4">
            <a
              onClick={handlePurchaseClick}
              className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
            >
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                <Image
                  priority
                  src={`${taco.thumbnail.url}?w=800&h=600&fit=crop`}
                  alt={taco.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "contain" }}
                  className="rounded-t-md"
                />
              </div>

              <div className="px-4 py-4 bg-slate-100 rounded-b-md">
                <h2 className="text-lg font-semibold">{taco.title}</h2>
                <p className="mt-2 text-lg text-slate-600">このレシピは○○...</p>
                <p className="mt-2 text-md text-slate-700">
                  値段：{taco.price}円
                </p>
              </div>
            </a>

            {showModal && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal">
                <div className="bg-white p-8 rounded-lg">
                  <h3 className="text-xl mb-4">レシピを購入しますか？</h3>
                  <button
                    onClick={handlePurchaseComfirm}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                  >
                    購入する
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </main>
  );
};

export default Taco;
