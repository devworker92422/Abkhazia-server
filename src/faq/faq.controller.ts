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
import { FAQBodyDTO, QuestionBodyDTO, AnswerBodyDTO } from "./faq.dto";


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

    @Post('/question')
    async getQuestions(@Body() body: FAQBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findAllQuestionByUser(body.limit, body.offset),
            total: await this.faqService.getTotalCountByUser()
        };
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
    async approveQuestion(@Body() body: QuestionBodyDTO) {
        let update: QuestionBodyDTO = { approve: true };
        console
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
    @Get('/question/clear')
    async clearQuestion() {
        await this.faqService.clearQuestion();
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
                msg: "You are owner of the question"
            }
        await this.faqService.insertAnswer(body, req.user.id)
        return {
            statusCode: HttpStatus.OK,
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
                msg: "You are owner of the answer"
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
                msg: "Permission Error"
            }
        }
        let update: AnswerBodyDTO = { approve: true };
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

    @UseGuards(AuthGuard('jwt'))
    @Get('/answer/clear')
    async clearAnswer() {
        await this.faqService.clearAnswer();
        return {
            statusCode: HttpStatus.OK
        };
    }
}