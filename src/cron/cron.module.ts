import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CronService } from "./cron.service";
import { GismeteoHttpService } from "src/weather/gismeteo.httpService";
import { WeatherService } from "src/weather/weather.service";
import { WeatherEntity } from "src/weather/weather.entity";
import { DirectionEntity } from "src/direction/direction.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([DirectionEntity, WeatherEntity]),
        HttpModule,
        ConfigModule
    ],
    providers: [CronService, GismeteoHttpService, WeatherService]
})

export class CronModule { }