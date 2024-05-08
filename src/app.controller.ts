import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return {
      statusCode: HttpStatus.OK,
      msg: "Server is running now"
    }
  }
}
