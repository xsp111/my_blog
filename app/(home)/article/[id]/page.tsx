import { getDB } from "@/db";
import { Article } from "@/db/entity";
import styles from "./index.module.scss";
import { Avatar } from "antd";
import { format } from "date-fns";
import { cookies } from "next/headers";
import Link from "next/link";
import MarkDown from 'markdown-to-jsx';

export default async function ArticlePage({ params }: { params: Promise<{ id : string }> }) {
    // 获取当前用户信息
    const cookie = await cookies();
    const user = JSON.parse(cookie.get("user")?.value || "{}");

    // 获取文章
    const { id } = await params;
    const myDataSource = await getDB();
    const article = await myDataSource
    .getRepository(Article)
    .createQueryBuilder("articles")
    .leftJoinAndSelect("articles.user", "users")
    .where("articles.id = :id", { id })
    .getOne();

    // 增加阅读量
    if (article) {
        article.views += 1;
        await myDataSource.manager.save(article);
    }


    return ( article &&
        <div className="content-layout">
            <h2 className={styles.title}>{article.title}</h2> 
            <div className={styles.user}>
                <Avatar src={article.user.avatar} size={50}/>
                <div className={styles.info}>
                    <div className={styles.name}>{article.user.nickname}</div>
                    <div className={styles.date}>
                        <div>{format(new Date(article.update_time), "yyyy MM dd HH:mm:ss")}</div>
                        <div>阅读 {article.views}</div>
                        {
                            Number(user.id) === article.user.id && (
                                <Link href={`/editor/${article.id}`} style={{ color: "#1e80ff" }}>编辑</Link>
                            )
                        }
                    </div>
                </div>
            </div>
            <MarkDown className={styles.markdown}>{article.content}</MarkDown>
        </div>
    );
}