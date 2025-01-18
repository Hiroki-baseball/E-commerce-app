import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET (
    request:Request,
    {params}: {params:{userId:string}}
) {
    const userId = params.userId;

    try {
        const purchase = await prisma.purchase.findMany({
            where: {userId:userId},
        });
        return NextResponse.json(purchase);
    }catch(err) {
        return NextResponse.json(err);
    }
}