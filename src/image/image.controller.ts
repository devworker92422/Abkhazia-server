import { Controller, UseInterceptors, Post, UploadedFile, HttpStatus, Body } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ImageService } from "./image.service";
import { ImageEntity } from "./image.entity";
import { RemoveImageBodyDTO } from "./image.dto";

@Controller('/img')

export class ImageController {

    constructor(
        private imageService: ImageService
    ) { }

    @Post('/direction')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './upload/direction',
            filename: (req, file, cb) => {
                return cb(null, `${Date.now()}${extname(file.originalname)}`);
            }
        })
    }))

    async uploadDirectionImage(@UploadedFile() file: Express.Multer.File) {
        if (!file)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Пустое изображение"
            }
        const newImage = ImageEntity.create();
        newImage.url = file.filename;
        await this.imageService.create(newImage)
        return {
            statusCode: HttpStatus.OK,
            data: file.filename
        }
    }

    @Post('/attraction')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './upload/attraction',
            filename: (req, file, cb) => {
                return cb(null, `${Date.now()}${extname(file.originalname)}`);
            }
        })
    }))
    async uploadAttractionImage(@UploadedFile() file: Express.Multer.File) {
        if (!file)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Пустое изображение"
            }
        const newImage = ImageEntity.create();
        newImage.url = file.filename;
        await this.imageService.create(newImage)
        return {
            statusCode: HttpStatus.OK,
            data: file.filename
        }
    }

    @Post('/blog')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './upload/blog',
            filename: (req, file, cb) => {
                return cb(null, `${Date.now()}${extname(file.originalname)}`);
            }
        })
    }))

    async uploadBlogImage(@UploadedFile() file: Express.Multer.File) {
        if (!file)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Пустое изображение"
            }
        const newImage = ImageEntity.create();
        newImage.url = file.filename;
        await this.imageService.create(newImage)
        return {
            statusCode: HttpStatus.OK,
            data: file.filename
        }
    }

    @Post('/meta')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './upload/meta',
            filename: (req, file, cb) => {
                return cb(null, `${Date.now()}${extname(file.originalname)}`);
            }
        })
    }))

    async uploadMetaImage(@UploadedFile() file: Express.Multer.File) {
        if (!file)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Пустое изображение"
            }
        return {
            statusCode: HttpStatus.OK,
            data: file.filename
        }
    }

    @Post('/remove')
    async removeImage(@Body() body: RemoveImageBodyDTO) {
        await this.imageService.remove(body.id);
        return {
            statusCode: HttpStatus.OK
        }
    }


}

