import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DirectionEntity } from "./direction.entity";
import { ContentEntity } from "src/content/content.entity";
import { ImageEntity } from "src/image/image.entity";
import { DirectionService } from "./direction.service";
import { ImageService } from "src/image/image.service";
import { DirectionController } from "./direction.controller";
import { WeatherModule } from "src/weather/weather.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([DirectionEntity, ContentEntity, ImageEntity]),
        WeatherModule
    ],
    providers: [DirectionService, ImageService],
    controllers: [DirectionController]
})

export class DirectionModule { }