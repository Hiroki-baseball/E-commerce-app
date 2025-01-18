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
