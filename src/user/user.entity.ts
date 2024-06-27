import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { QuestionEntity } from "src/faq/faq.entity";
import { AnswerEntity } from "src/faq/faq.entity";

@Entity()
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber: string;

    @Column({ default: false })
    phoneVerify: boolean;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    emailVerify: boolean;

    @Column({ nullable: true })
    avatar: string;

    @Column({ default: 0 })
    status: number;

    @Column({ default: 2 })
    type: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;
}