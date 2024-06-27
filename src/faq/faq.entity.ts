import { CONFIGURABLE_MODULE_ID } from "@nestjs/common/module-utils/constants";
import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";

@Entity()
export class QuestionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('longtext')
    questionText: string;

    @Column({ default: 0 })
    approve: number;

    @Column()
    ownerName: string;

    @Column()
    ownerAvatar: string;

    @Column()
    active: boolean;

    @OneToMany(
        () => AnswerEntity,
        (answers) => answers.question,
        {
            cascade: true
        }
    )
    answers: AnswerEntity[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;

}

@Entity()
export class AnswerEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('longtext')
    answerText: string;

    @Column({ default: 0 })
    approve: number;

    @Column({ default: 0 })
    rating: number;

    @Column()
    ownerName: string;

    @Column()
    ownerAvatar: string;

    @Column({ default: false })
    isRight: boolean;

    @ManyToOne(
        () => QuestionEntity,
        (question) => question.answers,
        {
            onDelete: 'CASCADE'
        }
    )
    question: QuestionEntity;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public createAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public updateAt: Date;
}