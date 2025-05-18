import getSession from "@/app/util/getIronSession";
import { getDB } from "@/db";
import { Tag } from "@/db/entity";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getSession();

    const myDataSource = await getDB();
    const tags = await myDataSource
        .getRepository(Tag)
        .createQueryBuilder('tags')
        .leftJoinAndSelect('tags.users', 'users')
        .getMany();

    if(session.id){
        console.log(tags);
        const followTags = tags.filter(tag => tag.users.some(user => user.id === session.id));
        console.log(session.id);
        console.log(followTags);
        return NextResponse.json({ 
            code: 0,
            msg: '获取成功',
            data: {
                allTags: tags,
                followTags,
            }
        });
    }

    return NextResponse.json({ 
        code: 0,
        msg: '获取成功',
        data: {
            allTags: tags,
            followTags: [],
        }
    });
}