import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';
import getSession from "@/app/util/getIronSession";
import { getDB } from "@/db";
import { User } from "@/db/entity";



export async function POST(req: NextRequest) {
    const session = await getSession();
    const formData = await req.formData()
    const file = formData.get('avatar') as File;
    // 校验文件类型
    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ 
            code: 1,
            msg: 'error' 
        });
    }

    // 更新db
    const myDataSource = await getDB();
    const user = await myDataSource
        .getRepository(User)
        .createQueryBuilder('users')
        .where('users.id = :id', { id: session.id })
        .getOne();
    if(user){
        user.avatar = `/avatar/${session.id}.png`;
        await myDataSource.manager.save(user);
        session.avatar = `/avatar/${session.id}.png`;
        await session.save();
        console.log(session.avatar);
    }

    // 生成文件名
    const filename = `${session.id}.png`;

    // 转换为 Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 写入 public 目录 (仅在dev! ！！)
    const publicPath = path.join(process.cwd(), 'public', 'avatar', filename);
    await writeFile(publicPath, buffer);
    // TODO 

    return NextResponse.json({
        code: 0,
        msg: 'success Upload',
        data:{
            avatar: `/avatar/${session.id}.png`,
        }
    })
}