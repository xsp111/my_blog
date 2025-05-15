import { getDB } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { Article, Tag } from "@/db/entity";

export async function GET(req: NextRequest) {
    // 获取文章id
    const id = req.nextUrl.searchParams.get('id');
    // 获取文章信息
    const myDataSource = await getDB();
    const article = await myDataSource
        .getRepository(Article)
        .createQueryBuilder("articles")
        .leftJoinAndSelect("articles.user", "users")
        .leftJoinAndSelect("articles.tags", "tags")
        .where("articles.id = :id", { id })
        .getOne();

    if(article){
        return NextResponse.json(({ 
            code: 0,
            msg: '获取成功',
            data: {
                title: article?.title,
                content: article?.content,
                tags: article?.tags,
            }
        }));
    }else{
        return NextResponse.json({ 
            code: 1,
            msg: '文章不存在',
            data: null
        });
    }
}

export async function POST(req: NextRequest) {
    const { title, content, id, selectedTags } = await req.json();
    const myDataSource = await getDB();
    const article = await myDataSource
        .getRepository(Article)
        .createQueryBuilder("articles")
        .leftJoinAndSelect("articles.user", "users")
        .where("articles.id = :id", { id })
        .getOne();

    // 获取文章标签信息
    const tags = await myDataSource
    .getRepository(Tag)
    .createQueryBuilder('tags')
    .where('tags.id IN (:...ids)', { ids: selectedTags })
    .getMany();

    if(article){
        // 保存文章内容
        article.title = title;
        article.content = content;
        article.update_time = new Date();
        article.tags = tags;
        await myDataSource.manager.save(article);

        return NextResponse.json({ 
            code: 0,
            msg: '修改成功',
            data: null
        });
    }else{
        return NextResponse.json({ 
            code: 1,
            msg: '修改失败',
            data: null
        });
    }
}