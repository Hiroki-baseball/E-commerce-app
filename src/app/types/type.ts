type TacoType = {
    id:string;
    title:string;
    content:string;
    price:number;
    thumbnail:{url:string};
    createAt:string;
    updatedAt:string;
};

type User = {
    id?:string;
    name?: string | null | undefined;
    email?: string | null| undefined;
    image?: string | null| undefined;
};

type Purchase = {
    id:string;
    userId:string;
    tacoId:string;
    createdAt:string;
    user:User;
};

export type {TacoType,User,Purchase};