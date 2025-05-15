import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import User from "./user";
import Article from "./article";
@Entity('tags')
export default class Tag {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    title: string;

    @Column()
    icon: string;

    @Column()
    follow_count: number;

    @Column()
    article_count: number;

    @ManyToMany(() => User, {
        cascade: true
    })
    @JoinTable()
    users: User[];

    @ManyToMany(() => Article, (article: Article) => article.tags)
    @JoinTable()
    articles: Article[];
}