import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import { NextResponse, NextRequest } from 'next/server'
import request from '@/app/service/fetch';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { ISession } from '@/app/api/index';

export async function POST(req: NextRequest) {
    const { to, templateId } = await req.json();
    const appId = '2c94811c946f6bfb0196334da63f501e';
    const accountId = '2c94811c946f6bfb0196334da4825017';
    const authToken = 'd822344285534cb3b7f3911b9106637c';
    const NowDate = format(new Date(), 'yyyyMMddHHmmss');
    const sigParameter = md5(`${accountId}${authToken}${NowDate}`);
    const authorization = encode(`${accountId}:${NowDate}`);
    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountId}/SMS/TemplateSMS?sig=${sigParameter}`;
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    const expireMin = 5; // 验证码过期时间，单位分钟

    const session: ISession = await getIronSession(await cookies(), {
        cookieName: 'sid',
        password: 'i4S6BvFigSN8VDOxBA5ooLGdldqfSdmS',
    });

    const response = await request.post(url, {
        to,
        templateId,
        appId,
        datas: [verifyCode, expireMin],
    }, {
        headers: {
            authorization,
        }
    });

    const { statusCode, statusMsg } = response as any;

    if (statusCode === '000000') {
        session.verifyCode = verifyCode;
        await session.save();
        return NextResponse.json({
            code: 0,
            msg: statusMsg,
        });
    } else {
        return NextResponse.json({
            code: statusCode,
            msg: statusMsg,
        });
    }
}
