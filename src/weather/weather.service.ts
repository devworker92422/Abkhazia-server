import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Like, Repository } from "typeorm";
import { WeatherEntity } from "./weather.entity";

@Injectable()

export class WeatherService {

    constructor(
        @InjectRepository(WeatherEntity)
        private weatherRepository: Repository<WeatherEntity>,
    ) { }

    getCountByDirection(directionID: number): Promise<number> {
        return this.weatherRepository.count({
            where: { direction: { id: directionID } }
        })
    }

    findAllByDirection(directionID: number): Promise<WeatherEntity[]> {
        return this.weatherRepository.find({
            order: { date: "ASC" },
            where: {
                direction: { id: directionID },
            },
        });
    }

    findOneByDirection(directionID: number, date: string): Promise<WeatherEntity[]> {
        return this.weatherRepository.find({
            order: { date: 'ASC' },
            where: {
                direction: { id: directionID },
                date: Like(`%${date}%`)
            },
        });
    }

    async insert(weather: WeatherEntity): Promise<void> {
        await this.weatherRepository.save(weather);
    }

    async removeAll(): Promise<void> {
        await this.weatherRepository.clear();
    }

}