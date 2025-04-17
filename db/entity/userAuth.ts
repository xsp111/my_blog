import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import User from "./user";

@Entity('user_auths')
export default class UserAuth {
    @PrimaryGeneratedColumn()
    id: number; 

    @ManyToOne(() => User, {
        cascade: true
    })
    @JoinColumn({
        name: 'user_id',
    })
    user: User;

    @Column()
    identity: string;

    @Column()
    identifier: string;

    @Column()
    credential: string;
}