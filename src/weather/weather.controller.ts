import { Body, Controller, HttpStatus, Post, Get } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { GismeteoHttpService } from "./gismeteo.httpService";
import {
    DirectionWeatherBodyDTO,
    TodayWeatherBodyDTO,
} from "./weather.dto";
import { WeatherEntity } from "./weather.entity";
import { DirectionEntity } from "src/direction/direction.entity";

@Controller('/weather')

export class WeatherController {
    constructor(
        private weatherService: WeatherService,
        private gismeteoHttpService: GismeteoHttpService,
    ) { }

    @Post('/today')
    async getTodayWeather(@Body() body: TodayWeatherBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.weatherService.findOneByDirection(body.directionID, body.date)
        }
    }

    @Post('/forecast')
    async getDirectionWeather(@Body() body: DirectionWeatherBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.weatherService.findAllByDirection(body.directionID)
        }
    }

    @Get('/clear')
    async clearWeather() {
        await this.weatherService.removeAll();
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Get('/cron')
    async cronJob() {
        await this.weatherService.removeAll();
        const directions = await DirectionEntity.find();
        for (const direction of directions) {
            const gisWeathers = await this.gismeteoHttpService.getAllWeatherData(direction.cityID);
            for (const weather of gisWeathers) {
                const newWeather = WeatherEntity.create();
                newWeather.direction = direction;
                newWeather.date = weather.date.local;
                newWeather.airTemp = weather.temperature.air.C;
                newWeather.comfortTemp = weather.temperature.comfort.C;
                newWeather.waterTemp = weather.temperature.water.C;
                newWeather.description = weather.description.full;
                newWeather.icon = weather.icon;
                await this.weatherService.insert(newWeather);
            }
        }
        return {
            statusCode: HttpStatus.OK,
            data: []
        }
    }
}