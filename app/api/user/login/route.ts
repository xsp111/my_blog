import getSession from "@/app/util/getIronSession";
import { NextRequest, NextResponse } from "next/server";
import  { getDB } from "@/db/index";
import { UserAuth } from "@/db/entity";


export async function POST(req: NextRequest){
    const { username, pwd, identity_type } = await req.json();
    const myDataSource = await getDB();
    const session = await getSession();

    // 将用户信息保存在ironsession
    async function saveUser( user: { id: number, nickname: string, avatar: string } ) {
        session.id = user.id;
        session.nickname =user.nickname;
        session.avatar = user.avatar;
        await session.save();
    }

    // 手机号登录逻辑
    // if( Number(verify) === session.verifyCode){
    //     // login success

    //     const userAuth = await myDataSource
    //     .getRepository(UserAuth)
    //     .createQueryBuilder('user_auths')
    //     .leftJoinAndSelect('user_auths.user', 'users')
    //     .where('user_auths.identifier = :identifier and user_auths.identity = :identity', { identifier: phone, identity: identity_type })
    //     .getOne();

    //     let user: IUser;
    //     if( userAuth ){
    //         user = userAuth.user;
    //     } else {
    //         // 用户不存在，创建用户
    //         const newUser = new User();
    //         newUser.nickname = `用户${Math.floor(Math.random() * 10000)}`;
    //         newUser.avatar = '/avatar/default.png';
    //         const userAuth = new UserAuth();
    //         userAuth.user = newUser;
    //         userAuth.identifier = phone;
    //         userAuth.identity = identity_type;
    //         userAuth.credential = verify;
    //         const resUserAuth = await myDataSource.manager.save(userAuth);
    //         user = resUserAuth.user;
    //     }

    //     await saveUser(user);

    //     // 创建响应对象
    //     const res = NextResponse.json({
    //         code: 0,
    //         msg: "登录成功",
    //         data: {
    //             id: session.id,
    //             nickname: session.nickname,
    //             avatar: session.avatar,
    //         },
    //     });

    //     return res;

    // } else {
    //     // login fail
    //     return NextResponse.json({
    //         code: 1,
    //         msg: '验证码错误'
    //     })
    // }

    const userAuth = await myDataSource
        .getRepository(UserAuth)
        .createQueryBuilder('user_auths')
        .leftJoinAndSelect('user_auths.user', 'users')
        .where('user_auths.identifier = :identifier and user_auths.identity = :identity', { identifier: username, identity: identity_type })
        .getOne();


    if(!userAuth){
        return NextResponse.json({
            code: 1,
            msg: '用户不存在'
        });
    }else if(userAuth.credential === pwd){
        await saveUser(userAuth.user);
        return NextResponse.json({
            code: 0,
            msg: '登陆成功',
            data: {
                id: userAuth.user.id,
                nickname: userAuth.user.nickname,
                avatar: userAuth.user.avatar
            }
        });
    }else{
        return NextResponse.json({
            code: 2,
            msg: '密码错误'
        })
    }
}