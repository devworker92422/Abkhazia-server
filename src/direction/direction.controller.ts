import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    HttpStatus,
    UseGuards,
    BadRequestException,
    UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as moment from 'moment';
import { GismeteoHttpService } from "src/weather/gismeteo.httpService";
import { DirectionService } from "./direction.service";
import { ImageService } from "src/image/image.service";
import { DirectionBodyDTO, NewDirectionBodyDTO } from "./direction.dto";
import { STANDARD_DATE_FORMAT } from "src/constant";
import * as sharp from 'sharp';

@Controller('direction')

export class DirectionController {

    constructor(
        private directionService: DirectionService,
        private gismeteoHttpService: GismeteoHttpService,
        private imageService: ImageService
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
    @UseGuards(AuthGuard('jwt'))
    async insertNewDirection(
        @Body() body: NewDirectionBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1) {
            throw new UnauthorizedException('Нет разрешения на доступ')
        }
        const gisCity = await this.gismeteoHttpService.getCityInfo(body.name);
        if (gisCity.total == 0)
            throw new BadRequestException('Название города неверное!');
        const imgInfo = body.bgImg.split('/');
        const thumbnailFileName = `/${imgInfo[0]}/thumbnails-${imgInfo[1]}`;
        sharp('./upload' + body.bgImg).resize(400, 400).toFile(`./upload${thumbnailFileName}`, (err, resizeImage) => {
            if (err) console.log(err);
        });
        body.thumbnail = thumbnailFileName;
        body.cityID = gisCity.items[0].id;
        await this.directionService.insert(body);
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('/update')
    @UseGuards(AuthGuard('jwt'))
    async updateDirection(
        @Body() body: NewDirectionBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1) {
            throw new UnauthorizedException('Нет разрешения на доступ')
        }
        await this.directionService.update(body);
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('/remove')
    @UseGuards(AuthGuard('jwt'))
    async removeDirection(
        @Body() body: DirectionBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1) {
            throw new UnauthorizedException('Нет разрешения на доступ')
        }
        await this.directionService.remove(body.id);
        return {
            statusCode: HttpStatus.OK,
        }
    }
}