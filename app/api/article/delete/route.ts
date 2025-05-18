import { getDB } from "@/db";
import { Article } from "@/db/entity";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const { id } = await req.json();
    const myDataSource = await getDB();

    const res = await myDataSource
    .createQueryBuilder()
    .delete()
    .from(Article)
    .where('articles.id = :id', { id })
    .execute();

    if(res){
        return NextResponse.json({
            code: 0,
            msg: '删除成功'
        });
    }else{
        return NextResponse.json({
            code: 1,
            msg: '删除失败'
        });
    }
}