import { getServerSession } from "next-auth";
import Taco from "./components/Taco";
import { getAllTacos } from "./lib/microcms/client";
import { TacoType, Purchase, User } from "./types/type";
import { nextAuthOptions } from "./lib/Next-auth/options";

export default async function Home() {
  const { contents } = await getAllTacos();
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchaseTacoIds: string[] = [];

  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
      { cache: "no-store" }
    );
    const purchasesData = await response.json();
    purchaseTacoIds = purchasesData.map(
      (purchaseTaco: Purchase) => purchaseTaco.tacoId
    );
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center bg-yellow-50">
        <h2 className="text-center w-full font-bold text-4xl mb-2 mt-6">
          Taco Recipes
        </h2>
        <h3 className="text-center w-full font-bold text-2xl text-gray-700 mt-6">
          本格的な
          <span className="text-green-500">メ</span>
          <span
            className="text-white"
            style={{ WebkitTextStroke: "1px black" }}
          >
            キシ
          </span>
          <span className="text-red-500">コ</span>
          の味を楽しもう！ストリートタコスから自家製の定番レシピまで、あらゆるタコスレシピを紹介。
        </h3>
        {contents.map((taco: TacoType) => (
          <Taco
            key={taco.id}
            taco={taco}
            isPurchased={purchaseTacoIds.includes(taco.id)}
            user={user}
          />
        ))}
      </main>
    </>
  );
}
