import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttractionService } from "./attraction.service";
import { AttractionController } from "./attraction.controller";
import { AttractionEntity } from "./attraction.entity";
import { DirectionEntity } from "src/direction/direction.entity";
import { ContentEntity } from "src/content/content.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([AttractionEntity, DirectionEntity, ContentEntity])
    ],
    providers: [AttractionService],
    controllers: [AttractionController]
})

export class AttractionModule { }