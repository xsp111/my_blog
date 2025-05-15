import getSession from "@/app/util/getIronSession";
import { NextRequest, NextResponse } from "next/server";
import  { getDB } from "@/db/index";
import { User, UserAuth } from "@/db/entity";


type IUser  = {
    id: number,
    nickname: string,
    avatar: string,
    verifyCode?: number,
}

export async function POST(req: NextRequest){
    const { verify, phone, identity_type } = await req.json();
    const myDataSource = await getDB();
    const session = await getSession();

    // 将用户信息保存在ironsession
    async function saveUser( user: { id: number, nickname: string, avatar: string } ) {
        session.id = user.id;
        session.nickname =user.nickname;
        session.avatar = user.avatar;
        await session.save();
    }

    if( Number(verify) === session.verifyCode){
        // login success

        const userAuth = await myDataSource
        .getRepository(UserAuth)
        .createQueryBuilder('user_auths')
        .leftJoinAndSelect('user_auths.user', 'users')
        .where('user_auths.identifier = :identifier and user_auths.identity = :identity', { identifier: phone, identity: identity_type })
        .getOne();

        let user: IUser;
        if( userAuth ){
            user = userAuth.user;
        } else {
            // 用户不存在，创建用户
            const newUser = new User();
            newUser.nickname = `用户${Math.floor(Math.random() * 10000)}`;
            newUser.avatar = '/avatar/default.png';
            const userAuth = new UserAuth();
            userAuth.user = newUser;
            userAuth.identifier = phone;
            userAuth.identity = identity_type;
            userAuth.credential = verify;
            const resUserAuth = await myDataSource.manager.save(userAuth);
            user = resUserAuth.user;
        }

        await saveUser(user);

        // 创建响应对象
        const res = NextResponse.json({
            code: 0,
            msg: "登录成功",
            data: {
                id: session.id,
                nickname: session.nickname,
                avatar: session.avatar,
            },
        });

        return res;

    } else {
        // login fail
        return NextResponse.json({
            code: 1,
            msg: '验证码错误'
        })
    }
}