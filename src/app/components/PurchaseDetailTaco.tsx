import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TacoType } from "../types/type";

type purchaseDetailTacoProps = {
  purchaseDetailTaco: TacoType;
};

const PurchaseDetailTaco = ({
  purchaseDetailTaco,
}: purchaseDetailTacoProps) => {
  return (
    <Link
      href={`/taco/${purchaseDetailTaco.id}`}
      className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
    >
      <div className="w-full">
        <Image
          priority
          src={purchaseDetailTaco.thumbnail.url}
          alt={purchaseDetailTaco.title}
          width={450}
          height={350}
          className="rounded-t-md"
          layout="responsive"
          objectFit="contain"
        />
      </div>
      <div className="px-4 py-4 bg-slate-100 rounded-b-md">
        <h2 className="text-lg font-semibold">{purchaseDetailTaco.title}</h2>
        <p className="mt-2 text-md text-slate-700">
          値段：{purchaseDetailTaco.price}円
        </p>
      </div>
    </Link>
  );
};

export default PurchaseDetailTaco;
