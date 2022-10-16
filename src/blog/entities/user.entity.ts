import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Role } from "../users/role/role.enum";
import { Article } from "./article.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "enum", enum: Role, default: Role.USER})
    role: Role;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    phoneNumber: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt?: string;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt?: string;

    @Column({nullable: true})
    userAvatar?: string;

    @Column("boolean", {default: false})
    confirmed: boolean;

    @OneToMany(() => Article, article => article.author)
    articles: Article[];
}
