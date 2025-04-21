import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import User from "./user";
import Article from "./article";
@Entity('comments')
export default class Comment {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    content: string;

    @Column()
    create_time: Date;

    @Column()
    update_time: Date;


    @ManyToOne(() => User, {
        cascade: true
    })
    @JoinColumn({
        name: 'user_id',
    })
    user: User;

    @ManyToOne(() => Article, (article) => article.comments,
    {
        cascade: true
    })
    @JoinColumn({
        name: 'article_id',
    })
    article: Article;
}