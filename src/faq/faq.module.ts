import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FAQController } from "./faq.controller";
import { FAQService } from "./faq.service";
import { QuestionEntity } from "./faq.entity";


@Module({
    imports: [TypeOrmModule.forFeature([QuestionEntity])],
    providers: [FAQService],
    controllers: [FAQController]
})

export class FAQModule { }