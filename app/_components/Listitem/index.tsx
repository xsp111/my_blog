import Link from "next/link";
import styles from "./index.module.scss";
import { EyeOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "antd";
import { markdownToTxt } from "markdown-to-txt";
import type { article } from "@/app/_components/articlePagination";

export default function Listitem({ article }: { article: article }) {

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h2 className={styles.title}>{article.title}</h2>
                <Avatar 
                    src={article.user.avatar} 
                    size={32}
                />
            </div>
            <div className={styles.userInfo}>
                <span className={styles.name}>{article.user.nickname}</span>
                <span className={styles.date}>{formatDistanceToNow(new Date(article.update_time)) + ' ago'}</span>
                <div className={styles.views}>
                    <span>
                        <EyeOutlined />{article.views}
                    </span>
                </div>
            </div>
            <p className={styles.content}>{markdownToTxt(article.content)}</p>      
            <Link href={`/article/${article.id}`}>
                <div className={styles.link}>阅读</div>
            </Link>
        </div>
    );
}