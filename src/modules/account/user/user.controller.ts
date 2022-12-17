import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import {
  CreateUserInput,
  UpdateUserInput,
  type UserOmittedPassword,
} from './user.dto'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('Account - User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  findAll(): Promise<UserOmittedPassword[]> {
    return this.service.findAll()
  }

  @Post()
  create(@Body() body: CreateUserInput): Promise<UserOmittedPassword> {
    return this.service.create(body)
  }

  @Patch()
  update(@Body() body: UpdateUserInput): Promise<UserOmittedPassword> {
    return this.service.update(body.id, body)
  }
}
