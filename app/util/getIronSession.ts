import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { IronSession } from "iron-session";


type ISession = IronSession<any> & Record<string, any>;


export default async function getSession() {
    const session: ISession = await getIronSession(await cookies(), {
        cookieName: 'sid',
        password: 'i4S6BvFigSN8VDOxBA5ooLGdldqfSdmS',
    });
    return session;
}
