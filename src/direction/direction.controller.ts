import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Query,
    Param,
    HttpStatus,
    BadRequestException,
} from "@nestjs/common";
import * as moment from 'moment';
import { GismeteoHttpService } from "src/weather/gismeteo.httpService";
import { DirectionService } from "./direction.service";
import {
    ListAllEntities,
    NewDirectionBodyDTO,
    UpdateDirectionBodyDTO
} from "./direction.dto";
import { STANDARD_DATE_FORMAT } from "src/constant";

@Controller('direction')

export class DirectionController {

    constructor(
        private directionService: DirectionService,
        private gismeteoHttpService: GismeteoHttpService,
    ) { }

    //User Routes

    @Get('active')
    async getActiveDirection() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.findAllActive()
        }
    }

    @Get()
    async getDirections(@Query() query: ListAllEntities) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.findAll(query.limit, query.offset),
            total: await this.directionService.getTotalCount()
        }
    }

    @Get(':id')
    async getDirection(@Param('id') id: string) {
        const direction = await this.directionService.findOne(parseInt(id));
        direction.weathers = direction.weathers.filter((a) => {
            return a.date.indexOf(moment().format(STANDARD_DATE_FORMAT)) >= 0
        })
        return {
            statusCode: HttpStatus.OK,
            data: direction
        }
    }

    // Admin Routes

    @Post()
    async createDirection(
        @Body() body: NewDirectionBodyDTO,
    ) {
        const gisCity = await this.gismeteoHttpService.getCityInfo(body.name);
        if (gisCity.total == 0)
            throw new BadRequestException('Название города неверное!');
        // const imgInfo = body.bgImg.split('/');
        // const thumbnailFileName = `/${imgInfo[0]}/thumbnails-${imgInfo[1]}`;
        // sharp('./upload' + body.bgImg).resize(400, 400).toFile(`./upload${thumbnailFileName}`, (err, resizeImage) => {
        //     if (err) console.log(err);
        // });
        // body.thumbnail = thumbnailFileName;
        body.cityID = gisCity.items[0].id;
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.create(body)
        }
    }

    @Put(':id')
    async updateDirection(
        @Param('id') id: string,
        @Body() body: UpdateDirectionBodyDTO,
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.update(parseInt(id), body)
        }
    }

    @Delete(':id')
    async removeDirection(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.directionService.remove(parseInt(id))
        }
    }
}