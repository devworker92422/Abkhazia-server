import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttractionService } from "./attraction.service";
import { ImageService } from "src/image/image.service";
import { AttractionController } from "./attraction.controller";
import { AttractionEntity } from "./attraction.entity";
import { DirectionEntity } from "src/direction/direction.entity";
import { ContentEntity } from "src/content/content.entity";
import { ImageEntity } from "src/image/image.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AttractionEntity,
            DirectionEntity,
            ContentEntity,
            ImageEntity
        ])
    ],
    providers: [AttractionService, ImageService],
    controllers: [AttractionController]
})

export class AttractionModule { }