import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import User from "./user";
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
}