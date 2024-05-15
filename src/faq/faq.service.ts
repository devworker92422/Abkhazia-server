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

    getTotalCountOfQuestionByUser(): Promise<number> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .count({
                where: {
                    approve: 1
                }
            });
    }

    getTotalCountOfQuestionByAdmin(whereCond: any): Promise<number> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .count({
                where: whereCond
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
                    approve: 1,
                },
                take: FAQ_RECENT_COUNT
            });
    }

    findAllQuestionByAdmin(limit: number, offset: number, whereCond: Object): Promise<QuestionEntity[]> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .find({
                relations: {
                    user: true,
                    answers: true
                },
                order: {
                    createAt: 'DESC'
                },
                where: whereCond,
                skip: offset,
                take: limit
            })
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
                    approve: 1,
                },
                skip: offset,
                take: limit
            });
    }

    findOneQuestionByAdmin(questionID: number): Promise<QuestionEntity> {
        return this.dataSource
            .getRepository(QuestionEntity)
            .findOne({
                relations: {
                    user: true,
                    answers: {
                        user: true
                    }
                },
                order: {
                    answers: {
                        rating: 'DESC',
                    }
                },
                where: {
                    id: questionID
                }
            })
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

    getTotalCountOfAnswerByAdmin(whereCond: Object): Promise<number> {
        return this.dataSource
            .getRepository(AnswerEntity)
            .count({
                where: whereCond
            })
    }

    findOneAnswer(id: number): Promise<AnswerEntity> {
        return this.dataSource
            .getRepository(AnswerEntity)
            .findOne({
                relations: {
                    user: true
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
                    user: true,
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

}