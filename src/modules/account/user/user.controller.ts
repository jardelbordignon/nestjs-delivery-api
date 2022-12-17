import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { User } from '@prisma/client'

import { CreateUserBody, UpdateUserBody } from './user.dto'
import { type UserOmittedPassword, UserService } from './user.service'

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
  create(@Body() body: CreateUserBody): Promise<UserOmittedPassword> {
    return this.service.create(body)
  }

  @Patch()
  update(@Body() body: UpdateUserBody): Promise<UserOmittedPassword> {
    return this.service.update(body.id, body)
  }
}
