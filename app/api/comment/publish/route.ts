import { getDB } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { Article, Comment, User } from "@/db/entity";
import getSession from "@/app/util/getIronSession";


export async function POST(req: NextRequest) {
    const { articleId, content } = await req.json();
    const myDataSource = await getDB();
    const session = await getSession();

    // 获取文章信息
    const article =  await myDataSource
    .getRepository(Article)
    .createQueryBuilder('articles')
    .where('articles.id = :articleId', { articleId })
    .getOne();

    // 获取评论用户信息
    const user = await myDataSource
    .getRepository(User)
    .createQueryBuilder('users')
    .where('users.id = :id', { id: session.id })
    .getOne();

    if(article && user){
        // 新建评论
        const newComment = new Comment();
        newComment.content = content;
        newComment.create_time = new Date();
        newComment.update_time = new Date();
        newComment.article = article;
        newComment.user = user;
        await myDataSource.manager.save(newComment);

        return NextResponse.json({ 
            code: 0,
            msg: '评论成功',
            data: {}
        });
    }else{
        return NextResponse.json({ 
            code: 1,
            msg: '评论失败',
            data: {}
        });
    }
}