import { getDB } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { Tag, User } from "@/db/entity";

export async function POST(req: NextRequest) {
    const { tagId, userId } = await req.json();

    const myDataSource = await getDB();

    const tag = await myDataSource
        .getRepository(Tag)
        .createQueryBuilder('tags')
        .leftJoinAndSelect('tags.users', 'users')
        .where('tags.id = :tagId', { tagId })
        .getOne();
    const user = await myDataSource
        .getRepository(User)
        .createQueryBuilder('users')
        .where('users.id = :userId', { userId })
        .getOne();

    if(tag && user) {
        tag.users = [...tag.users, user];
        tag.follow_count += 1;
        await myDataSource.manager.save(tag);

        const tags = await myDataSource
        .getRepository(Tag)
        .createQueryBuilder('tags')
        .leftJoinAndSelect('tags.users', 'users')
        .getMany();
        const followTags = tags.filter(tag => tag.users.some(user => user.id === Number(userId)));

        return NextResponse.json({ 
            code: 0,
            msg: '关注成功',
            data: {
                tags,
                followTags
            }
        });
    }
}