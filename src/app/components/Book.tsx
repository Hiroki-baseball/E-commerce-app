"use client";

import Image from "next/image";
import { BookType, User } from "../types/type";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
  user: User;
};

const Book = ({ book, isPurchased, user }: BookProps) => {
  const [showModal, setShowModal] = useState(false);
  // const { data: session } = useSession();
  const router = useRouter();

  // 型定義：ユーザー情報
  // const user = session?.user as {
  //   id: string;
  //   name?: string;
  //   email?: string;
  // } | null;

  const startCheckout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: book.title,
            price: book.price,
            userId: user?.id, // 型安全に
            bookId: book.id,
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
      alert("その商品は購入済みです");
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    // console.log("Modal state changed:", showModal);
  }, [showModal]); // showModalの変更を監視

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePurchaseComfirm = () => {
    if (!user) {
      setShowModal(false);
      router.push("/api/auth/signin"); // 未ログインの場合、ログインページへリダイレクト
    } else {
      startCheckout(); // ログイン済みなら決済処理を開始
    }
  };

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a
          onClick={handlePurchaseClick}
          className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
        >
          <Image
            priority
            src={book.thumbnail.url}
            alt={book.title}
            width={450}
            height={350}
            className="rounded-t-md"
          />
          <div className="px-4 py-4 bg-slate-100 rounded-b-md">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="mt-2 text-lg text-slate-600">この本は○○...</p>
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>

        {showModal && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl mb-4">本を購入しますか？</h3>
              <button
                onClick={handlePurchaseComfirm}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
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
    </>
  );
};

export default Book;
