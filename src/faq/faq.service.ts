import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { AnswerBodyDTO, QuestionBodyDTO, } from "./faq.dto";
import { FAQ_RECENT_COUNT } from "src/constant";
import { AnswerEntity } from "./faq.entity";
import { QuestionEntity } from "./faq.entity";
import { UserEntity } from "src/user/user.entity";

@Injectable()

export class FAQService {
    constructor(
        private dataSource: DataSource
    ) { }

    getTotalCountByUser(): Promise<number> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .count({
                where: {
                    approve: true
                }
            });
    }

    async createQuestion(body: QuestionBodyDTO, userID: number): Promise<void> {
        const question = this.dataSource
            .getRepository(QuestionEntity)
            .create();
        question.questionText = body.questionText;
        question.user = await this.dataSource
            .getRepository(UserEntity)
            .findOne({
                where: {
                    id: userID
                }
            });

        await question.save();
    }

    getRecentlyFAQ(): Promise<QuestionEntity[]> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .find({
                relations: {
                    answers: {
                        user: true
                    },
                },
                select: {
                    id: true,
                    questionText: true,
                    createAt: true,
                    answers: {
                        id: true,
                        rating: true,
                        answerText: true,
                        createAt: true,
                        user: {
                            type: true,
                        },
                    }
                },
                order: {
                    createAt: 'DESC',
                    answers: {
                        rating: 'DESC'
                    }
                },
                where: {
                    approve: true,
                },
                take: FAQ_RECENT_COUNT
            });
    }

    findAllQuestionByUser(limit: number, offset: number): Promise<QuestionEntity[]> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .find({
                relations: {
                    user: true,
                    answers: true,
                },
                select: {
                    id: true,
                    questionText: true,
                    approve: true,
                    createAt: true,
                    user: {
                        firstName: true,
                        lastName: true,
                        avatar: true
                    },
                    answers: {
                        id: true,
                        approve: true,
                    }
                },
                order: {
                    createAt: 'DESC',
                },
                where: {
                    approve: true,
                },
                skip: offset,
                take: limit
            });
    }

    findOneQuestionByUser(questionID: number): Promise<QuestionEntity> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .findOne({
                relations: {
                    user: true,
                    answers: {
                        user: true
                    },
                },
                select: {
                    id: true,
                    questionText: true,
                    createAt: true,
                    approve: true,
                    user: {
                        firstName: true,
                        lastName: true,
                        avatar: true
                    },
                    answers: {
                        id: true,
                        rating: true,
                        answerText: true,
                        createAt: true,
                        approve: true,
                        user: {
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            type: true,
                        }
                    }
                },
                order: {
                    answers: {
                        rating: 'DESC',
                    }
                },
                where: {
                    id: questionID,
                }
            });
    }

    async updateQuestion(id: number, update: QuestionBodyDTO): Promise<void> {
        await this.dataSource
            .getRepository(QuestionEntity)
            .update({ id }, update);
    }

    async removeQuestion(id: number): Promise<void> {
        await this.dataSource
            .getRepository(QuestionEntity)
            .delete(id);
    }

    async clearQuestion(): Promise<void> {
        await this.dataSource
            .getRepository(QuestionEntity)
            .clear();
    }

    async insertAnswer(body: AnswerBodyDTO, userID: number): Promise<void> {
        const answer = this.dataSource
            .getRepository(AnswerEntity)
            .create();
        answer.answerText = body.answerText;
        answer.user = await this.dataSource
            .getRepository(UserEntity)
            .findOne({
                where: {
                    id: userID
                }
            });
        answer.question = await this.dataSource
            .getRepository(QuestionEntity)
            .findOne({
                where: {
                    id: body.questionID
                }
            });

        await answer.save();
    }

    findOneAnswer(id: number): Promise<AnswerEntity> {
        return this.dataSource
            .getRepository(AnswerEntity)
            .findOne({
                where: {
                    id
                }
            });
    }

    async updateAnswer(id: number, update: AnswerBodyDTO): Promise<void> {
        await this.dataSource
            .getRepository(AnswerEntity)
            .update({ id }, update);
    }

    async removeAnswer(id: number): Promise<void> {
        await this.dataSource
            .getRepository(AnswerEntity)
            .delete(id);
    }

    async clearAnswer(): Promise<void> {
        await this.dataSource
            .getRepository(AnswerEntity)
            .clear();
    }

}