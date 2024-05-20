import {
    Controller,
    Body,
    Post,
    Get,
    Req,
    HttpStatus,
    UseGuards,
    UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BlogBodyDTO, NewBlogBodyDTO, SEODTO, SEOListBodyDTO } from "./blog.dto";
import { BlogService } from "./blog.service";
import { ImageService } from "src/image/image.service";
import { ImageEntity } from "src/image/image.entity";

@Controller('/blog')

export class BlogController {
    constructor(
        private blogService: BlogService,
        private imageService: ImageService
    ) { }

    @Get('/recentBlog')
    async getRecent() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findRecentlyBlog()
        }
    }

    @Post('/createBlog')
    @UseGuards(AuthGuard('jwt'))
    async insertBlog(
        @Body() body: NewBlogBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1)
            throw new UnauthorizedException('Нет разрешения на доступ')
        const newBlog = await this.blogService.insertBlog(body);
        for (const image of body.images) {
            const updatedImg = ImageEntity.create();
            updatedImg.id = image.id;
            updatedImg.blog = newBlog;
            await this.imageService.update(updatedImg);
        }
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('/getBlogs')
    async getBlogs(@Body() body: BlogBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findAllBlog(body),
            total: await this.blogService.getBlogTotalCount(body)
        }
    }

    @Post('/detailBlog')
    async detailBlog(@Body() body: BlogBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findOneBlog(body.id)
        }
    }

    @Post('/updateBlog')
    @UseGuards(AuthGuard('jwt'))
    async updateBlog(
        @Body() body: NewBlogBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1)
            throw new UnauthorizedException('Нет разрешения на доступ')
        const updatedBlog = await this.blogService.updateBlog(body);
        for (const image of body.images) {
            const updatedImg = ImageEntity.create();
            updatedImg.id = image.id;
            updatedImg.blog = updatedBlog;
            await this.imageService.update(updatedImg);
        }
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Post('/removeBlog')
    @UseGuards(AuthGuard('jwt'))
    async removeBlog(
        @Body() body: BlogBodyDTO,
        @Req() req
    ) {
        if (req.user.type != 1)
            throw new UnauthorizedException('Нет разрешения на доступ')
        await this.blogService.removeBlog(body.id);
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Get('/getSEOs')
    async getSEOS() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findAllSEO()
        }
    }

    @Post('/getSEOList')
    async getSEOList(@Body() body: SEOListBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.blogService.findSEOList(body),
            total: await this.blogService.getSEOTotal()
        }
    }

    @Post('/createSEO')
    @UseGuards(AuthGuard('jwt'))
    async insertSEO(
        @Body() body: SEODTO,
        @Req() req
    ) {
        if (req.user.type != 1)
            throw new UnauthorizedException('Нет разрешения на доступ')
        const seo = await this.blogService.findOneSEO(body.keyword);
        if (seo)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Ключевое слово уже существует!"
            }
        await this.blogService.insertSEO(body)
        return {
            statusCode: HttpStatus.OK,
        }
    }

    @Post('/updateSEO')
    @UseGuards(AuthGuard('jwt'))
    async updateSEO(
        @Body() body: SEODTO,
        @Req() req
    ) {
        if (req.user.type != 1)
            throw new UnauthorizedException('Нет разрешения на доступ')
        await this.blogService.updateSEO(body)
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Post('/removeSEO')
    @UseGuards(AuthGuard('jwt'))
    async removeSEO(
        @Body() body: SEODTO,
        @Req() req
    ) {
        if (req.user.type != 1)
            throw new UnauthorizedException('Нет разрешения на доступ')
        await this.blogService.removeSEO(body.id);
        return {
            statusCode: HttpStatus.OK
        }
    }

}
