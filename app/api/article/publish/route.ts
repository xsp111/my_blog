import getSession from "@/app/util/getIronSession";
import { getDB } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { User, Article } from "@/db/entity";


export async function POST(req: NextRequest) {
    const { title, content } = await req.json();
    const myDataSource = await getDB();
    const session = await getSession();

    // 获取文章发布者信息
    const user =  await myDataSource
    .getRepository(User)
    .createQueryBuilder('users')
    .where('users.id = :id', { id: session.id })
    .getOne();
    if(user){
        // 保存文章内容
        const newArticle = new Article();
        newArticle.title = title;
        newArticle.content = content;
        newArticle.create_time = new Date();
        newArticle.update_time = new Date();
        newArticle.views = 0;
        newArticle.is_deleted = 0;
        newArticle.user = user;
        await myDataSource.manager.save(newArticle);

        return NextResponse.json({ 
            code: 0,
            msg: '发布成功',
            data: {
                user_id: session.id,
            }
        });
    }else{
        return NextResponse.json({ 
            code: 1,
            msg: '未登录',
            data: {}
        });
    }
}