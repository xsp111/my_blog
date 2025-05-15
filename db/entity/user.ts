import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";
import type Tag from "./tag";
import type Article from "./article";

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    nickname: string;

    @Column()
    job: string;

    @Column()
    introduce: string;

    @Column()
    avatar: string;

    @OneToMany("Article", (article: Article) => article.user)
    articles: Article[];

    @ManyToMany("Tag", (tag: Tag) => tag.id,{
        cascade: true
    })
    tags: Tag[];
}