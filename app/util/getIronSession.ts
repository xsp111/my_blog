import { cookies } from "next/headers";
import { getIronSession } from "iron-session";




export default async function getSession() {
    const session = await getIronSession(await cookies(), {
        cookieName: 'sid',
        password: 'i4S6BvFigSN8VDOxBA5ooLGdldqfSdmS',
    });
    return session;
}
