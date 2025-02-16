import { TacoType } from '@/app/types/type';
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!, 
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

export const getAllTacos = async () => {
    const allTacos = await client.getList<TacoType>({
        endpoint:"tacosrecipe",
        customRequestInit:{
          next:{
            revalidate:3600
          }
        },
    });

    return allTacos;
};

export const getDetailTaco = async (contentId: string) => {
  const DetailTaco = await client.getListDetail<TacoType>({
    endpoint:"tacosrecipe",
    contentId,
    customRequestInit:{
      cache:"no-cache",
    },
  });
  return DetailTaco;
}