import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../lib/Next-auth/options";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user || null;
  // サーバーコンポーネントでクライアントコンポーネントにデータを渡す
  return <HeaderClient user={user} />;
}
