import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import User from "./user";
import Comment from "./comment";
@Entity('articles')
export default class Article {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    views: number;

    @Column()
    create_time: Date;

    @Column()
    update_time: Date;

    @Column()
    is_deleted: number;

    @ManyToOne(() => User, {
        cascade: true
    })
    @JoinColumn({
        name: 'user_id',
    })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[];
}