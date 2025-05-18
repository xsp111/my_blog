import getSession from "@/app/util/getIronSession";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await getSession();
    session.destroy();
    
     // 创建响应对象
     const res = NextResponse.json({
        code: 0,
        msg: "退出成功",
        data: {},
    });

    return res;
}