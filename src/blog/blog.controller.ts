import { Controller, Body, Post, Get, HttpStatus } from "@nestjs/common";
import { BlogBodyDTO, NewBlogBodyDTO, SEODTO } from "./blog.dto";
import { BlogService } from "./blog.service";

@Controller('/blog')

export class BlogController {
    constructor(
        private blogService: BlogService
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
        await this.blogService.insertBlog(body);
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
        await this.blogService.updateBlog(body)
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
