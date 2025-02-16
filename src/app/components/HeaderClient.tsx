"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "../types/type";

interface HeaderClientProps {
  user: User | null;
}

const HeaderClient = ({ user }: HeaderClientProps) => {
  return (
    <header className="bg-green-600 text-red-600 shadow-lg">
      <nav className="flex items-center justify-between p-4">
        <Link href={"/"} className="text-3xl font-bold">
          Taco Recipes
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
          >
            ホーム
          </Link>
          <Link
            href={user ? `/profile` : "/api/auth/signin"}
            className="text-red-600 hover:text-white px-3 py-2 rounded-md text-sm font-bold"
          >
            {user ? "プロフィール" : "ログイン"}
          </Link>

          {user ? (
            <Link
              // onClick={() => signOut({ callbackUrl: "/login" })}
              href={"/api/auth/signout"}
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログアウト
            </Link>
          ) : (
            ""
          )}

          <Link href={`/profile`}>
            <Image
              width={50}
              height={50}
              alt="profile_icon"
              src={user?.image || "/default_icon.png"}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default HeaderClient;
