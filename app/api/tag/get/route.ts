import { getDB } from "@/db";
import { Tag } from "@/db/entity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userCookie = req.cookies.get('user')?.value
    const id = userCookie ? JSON.parse(userCookie).id : null;

    const myDataSource = await getDB();
    const tags = await myDataSource
        .getRepository(Tag)
        .createQueryBuilder('tags')
        .leftJoinAndSelect('tags.users', 'users')
        .getMany();

    if(id){
        const followTags = tags.filter(tag => tag.users.some(user => user.id === Number(id)));
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