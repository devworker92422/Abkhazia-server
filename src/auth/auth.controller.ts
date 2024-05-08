import {
    Controller,
    Post,
    Body,
    HttpStatus,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { Express } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from 'fs';
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { UserBodyDTO } from "src/user/user.dto";

@Controller('/auth')

export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) { }

    @Post('/signup')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './upload/avatar',
            filename: (req, file, cb) => {
                return cb(null, `${Date.now()}${extname(file.originalname)}`);
            }
        })
    }))

    async signUp(@UploadedFile() file: Express.Multer.File, @Body() body: UserBodyDTO) {
        if (file)
            body.avatar = file.filename;
        else
            body.avatar = null;
        const user = await this.userService.findOne({ email: body.email });
        if (user) {
            if (file)
                fs.unlink(file.destination + '/' + file.filename, () => {
                    console.log("avatar remove success")
                })
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                msg: "Email is already registered"
            }
        }
        else
            return {
                statusCode: HttpStatus.OK,
                data: await this.authService.signUp(body)
            }
    }

    @Post('/signin')
    async signIn(@Body() body: UserBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.authService.signIn(body)
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/changePwd')
    async changePassword(@Body() body: UserBodyDTO) {

    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/update')
    async updateUserInfo(@Body() body: UserBodyDTO) {

    }

}