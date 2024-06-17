import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    HttpStatus,
} from "@nestjs/common";
import { CameraService } from "./camera.service";
import { CameraBodyDTO } from "./camera.dto";
import { CAMERA_CITY_LIST } from "src/constant";

@Controller('camera')

export class CameraController {
    constructor(
        private cameraService: CameraService
    ) { }

    @Post()
    async create(@Body() body: CameraBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.cameraService.create(body)
        }
    }

    @Get('init')
    async init() {
        await this.cameraService.clear();
        for (let city of CAMERA_CITY_LIST) {
            await this.cameraService.create(city);
        }
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Get()
    async getTotal() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.cameraService.getTotal()
        }
    }

    @Get('active')
    async getActive() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.cameraService.getActive()
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() body: CameraBodyDTO
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.cameraService.update(parseInt(id), body)
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.cameraService.remove(parseInt(id))
        }
    }
}
