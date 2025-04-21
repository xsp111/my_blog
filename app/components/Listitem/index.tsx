import Link from "next/link";
import styles from "./index.module.scss";
import { EyeOutlined } from "@ant-design/icons";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "antd";
import { markdownToTxt } from "markdown-to-txt";
import type { article } from "@/app/components/articlePagination";

export default function Listitem({ article }: { article: article }) {
    return (
        <Link href={`/article/${article.id}`}>
            <div className={styles.container}>
                <div className={styles.article}>
                    <div className={styles.userInfo}>
                        <span className={styles.name}>{article.user.nickname}</span>
                        <span className={styles.date}>{formatDistanceToNow(new Date(article.update_time)) + ' ago'}</span>
                    </div>
                    <h4 className={styles.title}>{article.title}</h4>
                    <p className={styles.content}>{markdownToTxt(article.content)}</p>
                    <div className={styles.views}>
                        <EyeOutlined />
                        <span>{article.views}</span>
                    </div>
                </div>
                <Avatar 
                    src={article.user.avatar} 
                    size={48}
                />
            </div>
        </Link>
        
    );    
}