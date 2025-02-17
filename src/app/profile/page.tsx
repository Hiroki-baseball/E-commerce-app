import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/Next-auth/options";
import { TacoType, Purchase, User } from "../types/type";
import { getDetailTaco } from "../lib/microcms/client";
import PurchaseDetailTaco from "../components/PurchaseDetailTaco";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchasesDetailTacos: TacoType[] = [];

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

    purchasesDetailTacos = await Promise.all(
      purchasesData.map(async (purchase: Purchase) => {
        return await getDetailTaco(purchase.tacoId);
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
        {purchasesDetailTacos.map((purchaseDetailTaco: TacoType) => (
          <PurchaseDetailTaco
            key={purchaseDetailTaco.id}
            purchaseDetailTaco={purchaseDetailTaco}
          />
        ))}
      </div>
    </div>
  );
}
