import { Controller, Get, HttpStatus, Post, Body } from "@nestjs/common";
import { MetaService } from "./meta.service";
import { MetaBodyDTO } from "./meta.dto";

@Controller('meta')
export class MetaController {
    constructor(
        private metaService: MetaService
    ) { }

    @Get()
    async getMetaData() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.metaService.getMetatData()
        }
    }

    @Post()
    async createOrUpdate(@Body() body: MetaBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.metaService.createOrUpdate(body)
        }
    }

}
