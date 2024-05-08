import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { WeatherEntity } from "./weather.entity";
import { WeatherService } from "./weather.service";
import { GismeteoHttpService } from "./gismeteo.httpService";
import { WeatherController } from "./weather.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([WeatherEntity]),
        HttpModule,
        ConfigModule
    ],
    providers: [WeatherService, GismeteoHttpService],
    controllers: [WeatherController],
    exports: [GismeteoHttpService]
})

export class WeatherModule { }