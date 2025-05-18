import getSession from "@/app/util/getIronSession";
import { NextResponse } from "next/server";


export async function GET() {
    const session = await getSession();
    return NextResponse.json({
        code: 0,
        msg: "登录成功",
        data: {
            id: session.id,
            nickname: session.nickname,
            avatar: session.avatar,
        },
    });
}