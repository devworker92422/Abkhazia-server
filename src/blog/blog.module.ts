import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity, SEOEntity } from "./blog.entity";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { ImageService } from "src/image/image.service";
import { ImageEntity } from "src/image/image.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([BlogEntity, SEOEntity, ImageEntity])
    ],
    controllers: [BlogController],
    providers: [BlogService, ImageService]
})

export class BlogModule { }