import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import {
  CreateAddressInput,
  CreateUserInput,
  UpdateAddressInput,
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

  @Get('addresses')
  findAllAddress() {
    return this.service.findUserAddresses('5728ad6d-ad5a-4d83-86ac-499722293641')
  }

  @Post('addresses')
  createAddress(@Body() body: CreateAddressInput) {
    return this.service.createUserAddress(
      '5728ad6d-ad5a-4d83-86ac-499722293641',
      body
    )
  }

  @Delete('addresses/:address_id')
  deleteUserAddress(@Param('address_id') address_id: string) {
    return this.service.deleteUserAddress(address_id)
  }

  @Patch('addresses')
  updateAddress(@Body() body: UpdateAddressInput) {
    return this.service.updateUserAddress(body)
  }
}
