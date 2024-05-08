import { Controller, Get, Post, Body, HttpStatus } from "@nestjs/common";
import * as moment from 'moment';
import { GismeteoHttpService } from "src/weather/gismeteo.httpService";
import { DirectionService } from "./direction.service";
import { DirectionBodyDTO, NewDirectionBodyDTO } from "./direction.dto";
import { STANDARD_DATE_FORMAT } from "src/constant";


@Controller('direction')

export class DirectionController {

    constructor(
        private directionService: DirectionService,
        private gismeteoHttpService: GismeteoHttpService
    ) { }

    @Post('/')
    async getDirections(@Body() body: DirectionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.findAll(body),
            total: await this.directionService.getTotalCount()
        }
    }

    @Get('/recent')
    async getRecentDirection() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.findRecently()
        }
    }

    @Post('/detail')
    async getDirection(@Body() body: DirectionBodyDTO) {
        const direction = await this.directionService.findOne(body.id);
        direction.weathers = direction.weathers.filter((a) => {
            return a.date.indexOf(moment().format(STANDARD_DATE_FORMAT)) >= 0
        })
        return {
            statusCode: HttpStatus.OK,
            data: direction
        }
    }

    @Post('/insert')
    async insertNewDirection(@Body() body: NewDirectionBodyDTO) {
        const gisCity = await this.gismeteoHttpService.getCityInfo(body.name);
        if (gisCity.total == 0)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                msg: "Название города неверное!"
            }
        body.cityID = gisCity.items[0].id;
        await this.directionService.insert(body);
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('/update')
    async updateDirection(@Body() body: NewDirectionBodyDTO) {
        await this.directionService.update(body)
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('/remove')
    async removeDirection(@Body() body: DirectionBodyDTO) {
        await this.directionService.remove(body.id);
        return {
            statusCode: HttpStatus.OK,
        }
    }
}