import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Req,
    Query,
    Param,
    Body,
    HttpStatus,
    UseGuards,
    BadRequestException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
    ListAllEntities,
    NewBlogBodyDTO,
    UpdateBlogBodyDTO,
    SEODTO,
} from "./blog.dto";
import { BlogService } from "./blog.service";
import { ImageService } from "src/image/image.service";

@Controller('blog')

export class BlogController {
    constructor(
        private blogService: BlogService,
        private imageService: ImageService
    ) { }


    // User Routes

    @Get('active')
    async getActiveBlogs() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findAllActiveBlog()
        }
    }

    @Post()
    async getBlogs(@Body() body: ListAllEntities) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findAllBlog(body),
            total: await this.blogService.getBlogTotalCount(body)
        }
    }

    @Get('detail/:id')
    async getBlog(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findOneBlog(parseInt(id))
        }
    }

    @Get('seo')
    async getSEOS() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findAllSEO()
        }
    }

    // Admin Routes

    @Post('create')
    async createBlog(
        @Body() body: NewBlogBodyDTO
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.createBlog(body)
        }
    }

    @Put(':id')
    // @UseGuards(AuthGuard('jwt'))
    async updateBlog(
        @Param('id') id: string,
        @Body() body: UpdateBlogBodyDTO,
        // @Req() req
    ) {
        // if (req.user.type != 1)
        //     throw new UnauthorizedException('Нет разрешения на доступ')
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.updateBlog(parseInt(id), body)
        }
    }

    @Delete(':id')
    async removeBlog(@Param('id') id: string) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.removeBlog(parseInt(id))
        }
    }

    @Get('admin/seo')
    async getPaginatedSEO(@Query() query: ListAllEntities) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findAllPaginatedSEO(query.limit, query.offset),
            total: await this.blogService.getSEOTotal()
        }
    }

    @Post('admin/seo')
    async createSEO(
        @Body() body: SEODTO
    ) {
        const seo = await this.blogService.findOneSEO(body.keyword);
        if (seo)
            throw new BadRequestException('Ключевое слово уже существует!');
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.createSEO(body)
        }
    }

    @Put('admin/seo/:id')
    async updateSEO(
        @Param('id') id: string,
        @Body() body: SEODTO,
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.updateSEO(parseInt(id), body)
        }
    }

    @Delete('admin/seo/:id')
    async removeSEO(
        @Param('id') id: string
    ) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.removeSEO(parseInt(id))
        }
    }

}
