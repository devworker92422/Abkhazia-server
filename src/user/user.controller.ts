import { Controller, Get, Post, Body, HttpStatus } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserBodyDTO, UserListBodyDTO } from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/')
    async getUserList(@Body() body: UserListBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.findAll(),
            total: await this.userService.getTotalCount()
        }
    }

    @Get('/')
    async getUsers() {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.findAll()
        }
    }

    @Post('/detail')
    async getUser(@Body() body: UserBodyDTO) {
        return {
            statusCode: HttpStatus.OK,
            data: await this.userService.findOneByID(body.id)
        }
    }

    @Post('/remove')
    async removeUser(@Body() body: UserBodyDTO) {
        await this.userService.remove(body.id);
        return {
            statusCode: HttpStatus.OK
        };
    }

    @Post('/update')
    async updateUser(@Body() body: UserBodyDTO) {
        await this.userService.update(body.id, body);
        return {
            statusCode: HttpStatus.OK
        };
    }


}