import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}