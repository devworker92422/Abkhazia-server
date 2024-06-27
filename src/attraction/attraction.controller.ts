import {
    Controller,
    HttpStatus,
    Post,
    Get,
    Body,
    Param,
    Query,
    Delete,
    Put
} from "@nestjs/common";
import { AttractionService } from "./attraction.service";
import { ImageService } from "src/image/image.service";
import {
    ListAllEntities,
    NewAttractionBodyDTO,
    UpdateAttractionBodyDTO
} from "./attraction.dto";

@Controller('attraction')

export class AttractionController {
    constructor(
        private attractionService: AttractionService,
        private imageService: ImageService
    ) { }

    // User Routes

    @Get('active')
    async getActiveAttraction() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findAllActive()
        }
    }

    @Get()
    async getAttractions(@Query() query: ListAllEntities) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findAll(query),
            total: await this.attractionService.getTotalCount(query.directionID),
        }
    }

    @Get(':id')
    async getAttraction(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.findOne(parseInt(id))
        }
    }

    // Admin Routes

    @Post()
    async createAttraction(
        @Body() body: NewAttractionBodyDTO,
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.create(body)
        }
    }

    @Put(':id')
    async updateAttraction(
        @Param('id') id: string,
        @Body() body: UpdateAttractionBodyDTO,
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.update(parseInt(id), body)
        };
    }

    @Delete(':id')
    async removeAttraction(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.attractionService.remove(parseInt(id))
        };
    }
}