import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import type { User } from '@prisma/client'

import { CreateUserBody } from './user.dto'
import { UserService } from './user.service'

@ApiBearerAuth()
@ApiTags('Account/User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll()
  }

  @Post()
  create(@Body() body: CreateUserBody): Promise<User> {
    const { email, name, password, permissions, roles } = body

    return this.service.create({ email, name, password, permissions, roles })
  }
}
