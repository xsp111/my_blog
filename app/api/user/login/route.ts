import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ISession } from "../..";
import  { getDB} from "@/db/index";
import { User, UserAuth } from "@/db/entity";



export async function POST(req: NextRequest){
    const { verify, phone, identity_type } = await req.json();
    const myDataSource = await getDB();
    const session: ISession = await getIronSession(await cookies(), {
        cookieName: 'sid',
        password: 'i4S6BvFigSN8VDOxBA5ooLGdldqfSdmS',
    })

    if( Number(verify) === session.verifyCode){
        // login success

        const userAuth = await myDataSource
        .getRepository(UserAuth)
        .createQueryBuilder('user_auths')
        .leftJoinAndSelect('user_auths.user', 'users')
        .where('user_auths.identifier = :identifier and user_auths.identity = :identity', { identifier: phone, identity: identity_type })
        .getOne();

        if( userAuth ){
            console.log(userAuth)
            const user = userAuth.user;
            const { id, nickname, avatar } = user;

            session.id = id;
            session.nickname = nickname;
            session.avatar = avatar;
            await session.save();
        } else {
            // 用户不存在，创建用户
            const user = new User();
            user.nickname = `用户${Math.floor(Math.random() * 10000)}`;
            user.avatar = '/avatar/default.png';

            const userAuth = new UserAuth();
            userAuth.user = user;
            userAuth.identifier = phone;
            userAuth.identity = identity_type;
            userAuth.credential = verify;
            const resUserAuth = await myDataSource.manager.save(userAuth);
            const { user: { id, nickname, avatar} } = resUserAuth;
            session.id = id;
            session.nickname = nickname;
            session.avatar = avatar;
            await session.save();
        }

        return NextResponse.json({
            code: 0,
            msg: '登录成功',
            data: {
                id: session.id,
                nickname: session.nickname,
                avatar: session.avatar
            }
        });
    } else {
        // login fail
        return NextResponse.json({
            code: 1,
            msg: '验证码错误'
        })
    }
}