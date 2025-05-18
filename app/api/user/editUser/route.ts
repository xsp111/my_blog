import getSession from "@/app/util/getIronSession";
import { getDB } from "@/db";
import { User, UserAuth } from "@/db/entity";
import { NextResponse, NextRequest } from "next/server";


export async function GET(){
    const myDataSource = await getDB();
    const session = await getSession();

    const user = await myDataSource
    .getRepository(User)
    .createQueryBuilder('users')
    .where('users.id = :id', { id: session.id })
    .getOne();

    console.log(user);

    if(user){
        return NextResponse.json({
            code: 0,
            data: {
                avatar: user.avatar,
                job: user.job ? user.job : '',
                description: user.introduce ? user.introduce : '',
                nickname: user.nickname
            }
        })
    }else{
        return NextResponse.json({
            code: 1,
            msg: '修改失败'
        })
    }
}

export async function POST(req: NextRequest){
    const { nickname, avatar, job, description } = await req.json();
    const session = await getSession();
    const myDataSource = await getDB();

    const user = await myDataSource
        .getRepository(User)
        .createQueryBuilder('users')
        .where('users.id = :id', { id: session.id })
        .getOne();

     const userAuth = await myDataSource
        .getRepository(UserAuth)
        .createQueryBuilder('user_auths')
        .leftJoinAndSelect('user_auths.user', 'users')
        .where('user_auths.identifier = :identifier', { identifier: session.nickname })
        .getOne();

    if(user && userAuth){
        user.avatar = avatar;
        user.nickname = nickname;
        user.job = job;
        user.introduce = description;
        userAuth.identifier = nickname;
        await myDataSource.manager.save([user, userAuth]);

        return NextResponse.json({
            code: 0,
            msg: '修改成功',
            data: {
                id: session.id
            }
        })
    }else{
        return NextResponse.json({
            code: 1,
            msg: '修改失败',
        });
    }
}