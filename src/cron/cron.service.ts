import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { GismeteoHttpService } from "src/weather/gismeteo.httpService";
import { WeatherService } from "src/weather/weather.service";
import { DirectionEntity } from "src/direction/direction.entity";
import { WeatherEntity } from "src/weather/weather.entity";

@Injectable()

export class CronService {
    constructor(
        private weatherService: WeatherService,
        private gismeteoHttpService: GismeteoHttpService
    ) { }
    private readonly logger = new Logger(CronService.name);

    @Cron('0 0 1 * * *', {
        name: 'weatherCron',
        timeZone: 'Europe/Moscow'
    })
    async handleCron() {
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
        this.logger.debug('Called when the current second is 45');
    }
}