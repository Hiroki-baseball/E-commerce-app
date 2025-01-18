// "use client";
// import { getServerSession } from "next-auth";
// import { signOut, useSession } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { nextAuthOptions } from "../lib/Next-auth/options";
// import { User } from "../types/type";

// const Header = async () => {
//   const session = await getServerSession(nextAuthOptions);
//   const user = session?.user as User;
//   // console.log(user);
//   return (
//     <header className="bg-slate-600 text-gray-100 shadow-lg">
//       <nav className="flex items-center justify-between p-4">
//         <Link href={"/"} className="text-xl font-bold">
//           Book Commerce
//         </Link>
//         <div className="flex items-center gap-1">
//           <Link
//             href="/"
//             className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//           >
//             ホーム
//           </Link>
//           <Link
//             href={user ? "profile" : "/login"}
//             className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//           >
//             {user ? "プロフィール" : "ログイン"}
//           </Link>

//           {user ? (
//             <button
//               // onClick={() => signOut({ callbackUrl: "/login" })}
//               className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//             >
//               ログアウト
//             </button>
//           ) : (
//             ""
//           )}

//           <Link href={`/profile`}>
//             <Image
//               width={50}
//               height={50}
//               alt="profile_icon"
//               src={user?.image || "/default_icon.png"}
//             />
//           </Link>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/Next-auth/options";
import HeaderClient from "./HeaderClient"; // クライアント部分を別ファイルに分離

export default async function Header() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user || null;
  console.log(session);
  console.log(user);
  // サーバーコンポーネントでクライアントコンポーネントにデータを渡す
  return <HeaderClient user={user} />;
}
