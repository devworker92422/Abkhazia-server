import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ImageController } from "./image.controller";
import { ImageService } from "./image.service";
import { ImageEntity } from "./image.entity";
import { DirectionEntity } from "src/direction/direction.entity";
import { AttractionEntity } from "src/attraction/attraction.entity";
import { BlogEntity } from "src/blog/blog.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ImageEntity,
            DirectionEntity,
            AttractionEntity,
            BlogEntity
        ]),
    ],
    controllers: [ImageController],
    providers: [ImageService]
})

export class ImageModule { }