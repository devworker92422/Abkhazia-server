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
import { ImageEntity } from "src/image/image.entity";



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
            throw new BadRequestException('Название города неверное!')
        body.cityID = gisCity.items[0].id;
        const newDirection = await this.directionService.insert(body);
        for (const image of body.images) {
            const updateImage = ImageEntity.create();
            updateImage.id = image.id
            updateImage.direction = newDirection;
            await this.imageService.update(updateImage);
        }
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
        const updatedDirection = await this.directionService.update(body);
        for (const image of body.images) {
            const updatedImg = ImageEntity.create();
            updatedImg.id = image.id;
            updatedImg.direction = updatedDirection;
            this.imageService.update(updatedImg);
        }
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