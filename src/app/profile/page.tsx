import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/Next-auth/options";
import { BookType, Purchase, User } from "../types/type";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchasesDetailBooks: BookType[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      console.error(
        `Error fetching data: ${response.status} - ${response.statusText}`
      );
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const purchasesData = await response.json();

    purchasesDetailBooks = await Promise.all(
      purchasesData.map(async (purchase: Purchase) => {
        return await getDetailBook(purchase.bookId);
      })
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
      <div className="flex items-center gap-6">
        {purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
          <PurchaseDetailBook
            key={purchaseDetailBook.id}
            purchaseDetailBook={purchaseDetailBook}
          />
        ))}
      </div>
    </div>
  );
}

// import { getServerSession } from "next-auth";
// import Image from "next/image";
// import { nextAuthOptions } from "../lib/Next-auth/options";
// import { BookType, Purchase, User } from "../types/type";
// import { getDetailBook } from "../lib/microcms/client";
// import PurchaseDetailBook from "../components/PurchaseDetailBook";

// export default async function ProfilePage() {
//   console.log("Fetching session...");
//   const session = await getServerSession(nextAuthOptions);
//   console.log("Session fetched:", session);

//   const user = session?.user as User;

//   if (!user) {
//     console.log("No user found in session.");
//     return <p>ログインしてください。</p>;
//   }

//   let purchasesDetailBooks: BookType[] = [];

//   try {
//     console.log(
//       "Fetching purchases from URL:",
//       `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
//     );

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
//       { cache: "no-store" }
//     );

//     console.log("Response status:", response.status, response.statusText);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch purchases. Status: ${response.status}`);
//     }

//     const purchasesData = await response.json();
//     console.log("Purchases data fetched:", purchasesData);

//     purchasesDetailBooks = await Promise.all(
//       purchasesData.map(async (purchase: Purchase) => {
//         console.log("Fetching book details for book ID:", purchase.bookId);
//         const bookDetail = await getDetailBook(purchase.bookId);
//         console.log("Book detail fetched:", bookDetail);
//         return bookDetail;
//       })
//     );
//   } catch (error) {
//     console.error("An error occurred:", error);

//     if (error instanceof Error) {
//       return <p>エラーが発生しました: {error.message}</p>;
//     } else {
//       return <p>不明なエラーが発生しました。</p>;
//     }
//   }

//   //   try {
//   //     console.log(`Fetching purchases for user ID: ${user.id}`);
//   //     const response = await fetch(
//   //       `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
//   //       { cache: "no-store" }
//   //     );

//   //     console.log("Response status:", response.status, response.statusText);

//   //     if (!response.ok) {
//   //       throw new Error(`Failed to fetch purchases. Status: ${response.status}`);
//   //     }

//   //     const purchasesData = await response.json();
//   //     console.log("Purchases data fetched:", purchasesData);

//   //     purchasesDetailBooks = await Promise.all(
//   //       purchasesData.map(async (purchase: Purchase) => {
//   //         console.log("Fetching book details for book ID:", purchase.bookId);
//   //         const bookDetail = await getDetailBook(purchase.bookId);
//   //         console.log("Book detail fetched:", bookDetail);
//   //         return bookDetail;
//   //       })
//   //     );
//   //   } catch (error) {
//   //     console.error("An error occurred:", error);
//   //     // return <p>エラーが発生しました: {error.message}</p>;
//   //   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-xl font-bold mb-4">プロフィール</h1>

//       <div className="bg-white shadow-md rounded p-4">
//         <div className="flex items-center">
//           <Image
//             priority
//             src={user.image || "/default_icon.png"}
//             alt="user profile_icon"
//             width={60}
//             height={60}
//             className="rounded-t-md"
//           />
//           <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
//         </div>
//       </div>

//       <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
//       <div className="flex items-center gap-6">
//         {purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
//           <PurchaseDetailBook
//             key={purchaseDetailBook.id}
//             purchaseDetailBook={purchaseDetailBook}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
