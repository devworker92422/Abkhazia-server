import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import {
    NewQuestionBodyDTO,
    UpdateQuestionBodyDTO,
    NewAnswerBodyDTO,
    UpdateAnswerBodyDTO
} from "./faq.dto";
import { AnswerEntity } from "./faq.entity";
import { QuestionEntity } from "./faq.entity";

@Injectable()

export class FAQService {
    constructor(
        private dataSource: DataSource
    ) { }

    getTotalCountOfApprovedQuestion(): Promise<number> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .count({
                where: {
                    approve: 1
                }
            });
    }

    getTotalCountOfQuestion(): Promise<number> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .count();
    }

    async createQuestion(body: NewQuestionBodyDTO): Promise<QuestionEntity> {
        return await this.dataSource
            .getRepository(QuestionEntity)
            .save(body);
    }

    findAllAciveQuestion(): Promise<QuestionEntity[]> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .find({
                relations: {
                    answers: true
                },
                order: {
                    createAt: 'DESC',
                },
                where: {
                    approve: 1,
                    active: true
                },
            });
    }

    findAllQuestion(limit: number, offset: number): Promise<QuestionEntity[]> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .find({
                relations: {
                    answers: true
                },
                order: {
                    createAt: 'DESC'
                },
                skip: offset,
                take: limit
            })
    }

    findAllApprovedQuestion(limit: number, offset: number): Promise<QuestionEntity[]> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .find({
                relations: {
                    answers: true,
                },
                order: {
                    createAt: 'DESC',
                },
                where: {
                    approve: 1,
                },
                skip: offset,
                take: limit
            });
    }

    findOneQuestion(id: number): Promise<QuestionEntity> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .findOne({
                relations: {
                    answers: true
                },
                order: {
                    answers: {
                        createAt: 'DESC'
                    }
                },
                where: {
                    id
                }
            })
    }

    async updateQuestion(id: number, update: UpdateQuestionBodyDTO): Promise<QuestionEntity> {
        await this.dataSource
            .getRepository(QuestionEntity)
            .update({ id }, update)
        return this.findOneQuestion(id);
    }

    async removeQuestion(id: number): Promise<{ id: number }> {
        await this.dataSource
            .getRepository(QuestionEntity)
            .delete(id);
        return { id };
    }

    async createAnswer(body: NewAnswerBodyDTO): Promise<AnswerEntity> {
        const answer = this.dataSource
            .getRepository(AnswerEntity)
            .create();
        answer.answerText = body.answerText;
        answer.ownerAvatar = body.ownerAvatar;
        answer.ownerName = body.ownerName;
        answer.question = await this.dataSource
            .getRepository(QuestionEntity)
            .findOne({
                where: {
                    id: body.questionID
                }
            });

        return await answer.save();
    }

    getTotalCountOfAnswerByAdmin(): Promise<number> {
        return this.dataSource
            .getRepository(AnswerEntity)
            .count()
    }

    findOneAnswer(id: number): Promise<AnswerEntity> {
        return this.dataSource
            .getRepository(AnswerEntity)
            .findOne({
                relations: {
                    question: true
                },
                where: {
                    id
                }
            });
    }

    findAllAnswer(limit: number, offset: number, whereCond: Object): Promise<AnswerEntity[]> {
        return this.dataSource
            .getRepository(AnswerEntity)
            .find({
                relations: {
                    question: true
                },
                where: whereCond,
                order: {
                    createAt: "DESC"
                },
                skip: offset,
                take: limit
            })
    }

    async updateAnswer(id: number, update: UpdateAnswerBodyDTO): Promise<AnswerEntity> {
        await this.dataSource
            .getRepository(AnswerEntity)
            .update({ id }, update);
        return this.findOneAnswer(id);
    }

    async removeAnswer(id: number): Promise<{ id: number }> {
        await this.dataSource
            .getRepository(AnswerEntity)
            .delete(id);
        return { id }
    }

}