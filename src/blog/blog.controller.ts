import { Controller, Body, Post, Get, HttpStatus } from "@nestjs/common";
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
    async insertBlog(@Body() body: NewBlogBodyDTO) {
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
    async updateBlog(@Body() body: NewBlogBodyDTO) {
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
    async removeBlog(@Body() body: BlogBodyDTO) {
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
    async insertSEO(@Body() body: SEODTO) {
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
    async updateSEO(@Body() body: SEODTO) {
        await this.blogService.updateSEO(body)
        return {
            statusCode: HttpStatus.OK
        }
    }

    @Post('/removeSEO')
    async removeSEO(@Body() body: SEODTO) {
        await this.blogService.removeSEO(body.id);
        return {
            statusCode: HttpStatus.OK
        }
    }

}
