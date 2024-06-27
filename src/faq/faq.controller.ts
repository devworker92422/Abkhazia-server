import {
    Controller,
    Get,
    Post,
    HttpStatus,
    Body,
    Param,
    Query,
    Put,
    Delete
} from "@nestjs/common";
import { FAQService } from "./faq.service";
import {
    NewQuestionBodyDTO,
    UpdateQuestionBodyDTO,
    ListAllEntities,
    NewAnswerBodyDTO,
    UpdateAnswerBodyDTO,
} from "./faq.dto";


@Controller('faq')
export class FAQController {
    constructor(private faqService: FAQService) { }

    // User Routes

    @Get('active')
    async getActiveFAQ() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findAllAciveQuestion()
        }
    }

    @Post('question')
    async createQuestion(@Body() body: NewQuestionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.createQuestion(body)
        };
    }

    @Get('question')
    async getQuestions(@Query() query: ListAllEntities) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findAllApprovedQuestion(query.limit, query.offset),
            total: await this.faqService.getTotalCountOfApprovedQuestion()
        };
    }

    @Get('question/:id')
    async getQuestion(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findOneQuestion(parseInt(id))
        }
    }

    @Post('answer')
    async createAnswer(@Body() body: NewAnswerBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.createAnswer(body)
        }
    }

    @Put('answer/:id')
    async updateRatingOfAnswer(@Param('id') id: string, @Body() body: UpdateAnswerBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.updateAnswer(parseInt(id), { rating: body.rating })
        }
    }

    // Admin Routes

    @Get('admin/question')
    async getQuestionsByAdmin(@Query() query: ListAllEntities) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findAllQuestion(query.limit, query.offset),
            total: await this.faqService.getTotalCountOfQuestion()
        }
    }

    @Get('admin/question/:id')
    async getQuestionByAdmin(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.findOneQuestion(parseInt(id))
        }
    }

    @Put('admin/question/:id')
    async updateQuestion(
        @Param('id') id: string,
        @Body() body: UpdateQuestionBodyDTO
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.updateQuestion(parseInt(id), body)
        };
    }

    @Delete('admin/question/:id')
    async removeQuestion(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.removeQuestion(parseInt(id))
        };
    }

    @Put('admin/answer/:id')
    async updateAnswer(
        @Param('id') id: string,
        @Body() body: UpdateAnswerBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.updateAnswer(parseInt(id), body)
        }
    }

    @Delete('admin/answer/:id')
    async removeAnswer(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.faqService.removeAnswer(parseInt(id))
        };
    }
}