import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.entity";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column()
    content: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt?: string;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt?: string;

    @ManyToOne(() => User, user => user.articles)
    author: User;
}
