import { Controller, HttpStatus, Post, Get, Body } from "@nestjs/common";
import { AttractionService } from "./attraction.service";
import { AttractionBodyDTO, NewAttractionBodyDTO } from "./attraction.dto";

@Controller('/attraction')

export class AttractionController {
    constructor(
        private attractionService: AttractionService
    ) { }

    @Post('/insert')
    async insertNewAttraction(@Body() body: NewAttractionBodyDTO) {
        await this.attractionService.insert(body);
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Post('/')
    async getAttractions(@Body() body: AttractionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findAll(body),
            total: await this.attractionService.getTotalCount(body.directionID),
        }
    }

    @Get('/recent')
    async getRecently() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findRecently()
        }
    }

    @Post('/detail')
    async getAttraction(@Body() body: AttractionBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findOne(body.attractionID)
        }
    }

    @Post('/update')
    async updateAttraction(@Body() body: NewAttractionBodyDTO) {
        await this.attractionService.update(body);
        return {
            statusCode: HttpStatus.OK
        };
    }

    @Post('/remove')
    async removeAttraction(@Body() body: AttractionBodyDTO) {
        await this.attractionService.remove(body.attractionID);
        return {
            statusCode: HttpStatus.OK
        };
    }
}