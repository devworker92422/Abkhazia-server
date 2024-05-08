import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DirectionEntity } from "./direction.entity";
import { ContentEntity } from "src/content/content.entity";
import { DirectionService } from "./direction.service";
import { DirectionController } from "./direction.controller";
import { WeatherModule } from "src/weather/weather.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([DirectionEntity, ContentEntity]),
        WeatherModule
    ],
    providers: [DirectionService],
    controllers: [DirectionController]
})

export class DirectionModule { }