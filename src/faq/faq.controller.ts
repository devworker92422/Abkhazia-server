import {
    Controller,
    Get,
    Post,
    HttpStatus,
    Body,
    UseGuards,
    Req
} from "@nestjs/common";
import { FAQService } from "./faq.service";
import { AuthGuard } from "@nestjs/passport";
import { FAQBodyDTO, QuestionBodyDTO, AnswerBodyDTO, FAQListBodyDTO } from "./faq.dto";
import { Like } from "typeorm";


@Controller('faq')
export class FAQController {
    constructor(private faqService: FAQService) { }

    @Get('/recent')
    async getRecentlyFAQ() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.getRecentlyFAQ()
        }
    }

    @Post('/question/create')
    @UseGuards(AuthGuard('jwt'))
    async createQuestion(@Body() body: QuestionBodyDTO, @Req() req) {
        await this.faqService.createQuestion(body, req.user.id);
        return {
            statusCode: HttpStatus.OK
        };
    }

    @Post('/questionByAdmin')
    async getQuestionsByAdmin(@Body() body: FAQListBodyDTO) {
        let whereCond = {};
        if (body.approve)
            whereCond['approve'] = body.approve;
        if (body.text)
            whereCond['questionText'] = Like(`%${body.text}%`);
        if (body.userID)
            whereCond['user'] = { id: body.userID };
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findAllQuestionByAdmin(body.limit, body.offset, whereCond),
            total: await this.faqService.getTotalCountOfQuestionByAdmin(whereCond)
        }
    }

    @Post('/question')
    async getQuestions(@Body() body: FAQBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findAllQuestionByUser(body.limit, body.offset),
            total: await this.faqService.getTotalCountOfQuestionByUser()
        };
    }


    @Post('/question/detailByAdmin')
    async getFAQByAdmin(@Body() body: QuestionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findOneQuestionByAdmin(body.id)
        }
    }

    @Post('/question/detail')
    async getFAQ(@Body() body: QuestionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findOneQuestionByUser(body.id)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/question/approve')
    async approveQuestion(@Body() body: QuestionBodyDTO, @Req() req) {
        let update: QuestionBodyDTO = { approve: 1 };
        if (req.user.type != 1) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                msg: "Ошибка разрешения"
            }
        }
        await this.faqService.updateQuestion(body.id, update);
        return {
            statusCode: HttpStatus.OK,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/question/disapprove')
    async disApproveQuestion(@Body() body: QuestionBodyDTO, @Req() req) {
        let update: QuestionBodyDTO = { approve: 2 };
        if (req.user.type != 1) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                msg: "Ошибка разрешения"
            }
        }
        await this.faqService.updateQuestion(body.id, update);
        return {
            statusCode: HttpStatus.OK,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/question/update')
    async updateQuestion(@Body() body: QuestionBodyDTO) {
        await this.faqService.updateQuestion(body.id, body);
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/question/remove')
    async removeQuestion(@Body() body: QuestionBodyDTO) {
        await this.faqService.removeQuestion(body.id);
        return {
            statusCode: HttpStatus.OK
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer/create')
    async createAnswer(@Body() body: AnswerBodyDTO, @Req() req) {
        const userID = req.user.id;
        const question = await this.faqService.findOneQuestionByUser(body.questionID);
        if (userID == question.user.id)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                msg: "Вы являетесь владельцем вопроса"
            }
        await this.faqService.insertAnswer(body, req.user.id)
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer')
    async getAnswersOfQuestion(@Body() body: FAQListBodyDTO, @Req() req) {
        let whereCond = {};
        if (body.approve)
            whereCond['approve'] = body.approve;
        if (body.text)
            whereCond['answerText'] = Like(`%${body.text}%`);
        if (body.userID)
            whereCond['user'] = { id: body.userID };
        return {
            statusCode: HttpStatus.OK,
            total: await this.faqService.getTotalCountOfAnswerByAdmin(whereCond),
            data: await this.faqService.findAllAnswer(body.limit, body.offset, whereCond)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer/rating')
    async updateRatingOfAnswer(@Body() body: AnswerBodyDTO, @Req() req) {
        const userID = req.user.id;
        const answer = await this.faqService.findOneAnswer(body.id);
        let rating = answer.rating;
        if (userID == answer.user.id)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                msg: "Вы являетесь владельцем ответа"
            }
        const flag = rating.find((a) => { return a == userID });
        if (flag) {
            rating.splice(rating.indexOf(userID), 1);
        } else {
            rating.push(userID);
        }
        let update: AnswerBodyDTO = { rating }
        await this.faqService.updateAnswer(body.id, update);
        return {
            statusCode: HttpStatus.OK,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer/approve')
    async approveAnswer(@Body() body: AnswerBodyDTO, @Req() req) {
        if (req.user.type != 1) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                msg: "Ошибка разрешения"
            }
        }
        let update: AnswerBodyDTO = { approve: 1 };
        await this.faqService.updateAnswer(body.id, update);
        return {
            statusCode: HttpStatus.OK,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer/disApprove')
    async disApproveAnswer(@Body() body: AnswerBodyDTO, @Req() req) {
        if (req.user.type != 1) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                msg: "Ошибка разрешения"
            }
        }
        let update: AnswerBodyDTO = { approve: 2 };
        await this.faqService.updateAnswer(body.id, update);
        return {
            statusCode: HttpStatus.OK,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer/update')
    async updateAnswer(@Body() body: AnswerBodyDTO) {
        await this.faqService.updateAnswer(body.id, body);
        return {
            statusCode: HttpStatus.OK
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/answer/remove')
    async removeAnswer(@Body() body: AnswerBodyDTO) {
        await this.faqService.removeAnswer(body.id);
        return {
            statusCode: HttpStatus.OK
        };
    }
}