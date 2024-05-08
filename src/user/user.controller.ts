import { Controller, Get, Post, Body, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserBodyDTO } from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/signup')
    async signUp(@Body() body: UserBodyDTO) {
        const cond: UserBodyDTO = { email: body.email };
        const user = this.userService.findOne(cond);
        if (user)
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                msg: "Email is already registered"
            }
        await this.userService.signUp(body);
        return {
            statusCode: HttpStatus.OK
        }
    }


}