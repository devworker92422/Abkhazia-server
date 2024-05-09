import { Controller, Get, HttpStatus } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller()
export class AppController {

  constructor(
    private readonly schedule: SchedulerRegistry
  ) { }

  @Get()
  index() {
    console.log(this.schedule.getCronJobs())
    return {
      statusCode: HttpStatus.OK,
      msg: "Server is running now"
    }
  }
}
