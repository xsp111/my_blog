import { NextRequest, NextResponse } from "next/server";
import  { getDB } from "@/db/index";
import { User, UserAuth } from "@/db/entity";



export async function POST(req: NextRequest){
    const { username, pwd, identity_type } = await req.json();
    const myDataSource = await getDB();

    const isUserExist = await myDataSource
        .getRepository(User)
        .createQueryBuilder('users')
        .where('users.nickname = :username', { username })
        .getOne();

    if( isUserExist ){
        return NextResponse.json({
            code: 1,
            msg: "该用户已存在",
        });
    }

    const newUser = new User();
    newUser.nickname = username;
    newUser.avatar = '/avatar/default.png';
    const userAuth = new UserAuth();
    userAuth.user = newUser;
    userAuth.identifier = username;
    userAuth.identity = identity_type;
    userAuth.credential = pwd;
    await myDataSource.manager.save(userAuth);

    // 创建响应对象
    const res = NextResponse.json({
        code: 0,
        msg: "注册成功",
    });
    return res;

}