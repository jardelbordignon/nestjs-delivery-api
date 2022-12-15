import { Body, Controller, Get, Post } from '@nestjs/common'

import { AppService } from './app.service'

type BodyProps = {
  message: string
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Post()
  setHello(@Body() body: BodyProps): string {
    const { message } = body

    console.log(message)
    return message
  }
}
