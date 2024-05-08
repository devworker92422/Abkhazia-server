import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity, SEOEntity } from "./blog.entity";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity, SEOEntity])
    ],
    controllers: [BlogController],
    providers: [BlogService]
})

export class BlogModule { }