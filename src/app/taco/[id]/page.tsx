import { getDetailTaco } from "@/app/lib/microcms/client";
import Image from "next/image";
import React from "react";

const DetailTaco = async ({ params }: { params: { id: string } }) => {
  //   console.log(params.id);
  const taco = await getDetailTaco(params.id);
  //   console.log(taco);

  return (
    <div className="container mx-auto p-4">
      <div className="w-1/2 mx-auto">
        <div className="p-4">
          <h2 className="text-2xl font-bold">{taco.title}</h2>
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: taco.content }}
          />
          <Image
            src={`${taco.thumbnail.url}?w=700&h=700`}
            className="w-full h-auto object-contain"
            width={700}
            height={700}
            alt={taco.title}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              公開日:{new Date(taco.publishedAt as any).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              最終更新:{new Date(taco.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTaco;
