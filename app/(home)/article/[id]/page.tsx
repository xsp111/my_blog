import { getDB } from "@/db";
import { Article, Comment } from "@/db/entity";
import styles from "./index.module.scss";
import { Avatar, Divider } from "antd";
import { format } from "date-fns";
import { cookies } from "next/headers";
import Link from "next/link";
import MarkDown from 'markdown-to-jsx';
import  CommentInput from "@/app/components/comment/commentInput";

export default async function ArticlePage({ params }: { params: Promise<{ id : string }> }) {
    // 获取当前用户信息
    const cookie = await cookies();
    const user = JSON.parse(cookie.get("user")?.value || "{}");

    const { id } = await params;
    const myDataSource = await getDB();
    // 获取文章
    const article = await myDataSource
    .getRepository(Article)
    .createQueryBuilder("articles")
    .leftJoinAndSelect("articles.user", "users")
    .where("articles.id = :id", { id })
    .getOne();

    const comments = await myDataSource
    .getRepository(Comment)
    .createQueryBuilder("comments")
    .leftJoinAndSelect("comments.user", "users")
    .where("comments.article_id = :id", { id })
    .getMany();
    console.log(comments);

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
                                <Link href={`/editor/modify?id=${article.id}`} style={{ color: "#1e80ff" }}>编辑</Link>
                            )
                        }
                    </div>
                </div>
            </div>
            <MarkDown className={styles.markdown}>{article.content}</MarkDown>
            <Divider />
            <div className={styles.comment}>
                <h3>评论</h3>
                {
                    user.id && (
                        <CommentInput 
                            user={user} 
                            articleId={article.id}
                        />
                    )
                }
                <div className={styles.commentList}>
                    {
                        comments.map((comment) => (
                            <div key={comment.id}>
                                <div className={styles.wrapper}>
                                    <Avatar 
                                        src={comment.user.avatar} 
                                        size={40}
                                        style={{ alignItems: 'flex-start' }}
                                    />
                                    <div className={styles.info}>
                                        <div className={styles.name}>
                                            <div>{comment.user.nickname}</div>
                                            <div className={styles.date}>
                                                {format(new Date(comment.create_time), "yyyy MM dd HH:mm")}
                                            </div>
                                        </div>
                                        <div className={styles.content}>
                                            {comment.content}
                                        </div>
                                    </div>
                                </div>
                                <Divider/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}