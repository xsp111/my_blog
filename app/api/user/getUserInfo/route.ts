import getSession from "@/app/util/getIronSession";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const session = await getSession();
    console.log(req);
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