import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'

import { AllowUnauthenticated, AuthorizationGuard } from 'src/infra/guards'
import { RequestWithUser } from 'src/types'

import {
  CreateUserAddressInput,
  CreateUserInput,
  UpdateUserAccessLevelInput,
  UpdateUserAddressInput,
  UpdateUserInput,
  type UserOmittedPassword,
} from './user.dto'
import { UserService } from './user.service'

@ApiTags('Account - User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiResponse({ description: 'A list of user whit omitted password' })
  @AllowUnauthenticated()
  @Get()
  findAll(): Promise<UserOmittedPassword[]> {
    return this.service.findAll()
  }

  @ApiResponse({ description: 'The created user whit omitted password' })
  @AllowUnauthenticated()
  @Post()
  create(@Body() body: CreateUserInput): Promise<UserOmittedPassword> {
    return this.service.create(body)
  }

  @ApiResponse({ description: 'The updated user whit omitted password' })
  @ApiBearerAuth()
  @Patch()
  update(
    @Body() body: UpdateUserInput,
    @Request() req: RequestWithUser
  ): Promise<UserOmittedPassword> {
    return this.service.update(req.user.id, body)
  }

  @ApiResponse({ description: 'The updated user access level whit omitted password' })
  @ApiBearerAuth()
  @UseGuards(
    AuthorizationGuard({
      roles: [Role.DELIVERYMAN, Role.CLIENT],
      permissions: ['user.access_level', 'user.test', 'user.upgrade'],
      needAllPermissions: true,
    })
  )
  @Patch('access_level')
  updateAccessLevel(
    @Body() body: UpdateUserAccessLevelInput,
    @Request() req: RequestWithUser
  ): Promise<UserOmittedPassword> {
    return this.service.updateAccessLevel(req.user.id, body)
  }

  @ApiResponse({ description: 'The updated user access level whit omitted password' })
  @ApiBearerAuth()
  @Delete()
  @UseGuards(AuthorizationGuard({ permissions: ['user.delete'] }))
  delete(@Request() req: RequestWithUser) {
    return this.service.delete(req.user.id)
  }

  @ApiBearerAuth()
  @Get('addresses')
  findUserAddresses(@Request() req: RequestWithUser) {
    return this.service.findUserAddresses(req.user.id)
  }

  @ApiBearerAuth()
  @Post('addresses')
  createUserAddress(
    @Body() body: CreateUserAddressInput,
    @Request() req: RequestWithUser
  ) {
    return this.service.createUserAddress(req.user.id, body)
  }

  @ApiBearerAuth()
  @Delete('addresses/:address_id')
  deleteUserAddress(
    @Param('address_id') address_id: string,
    @Request() req: RequestWithUser
  ) {
    return this.service.deleteUserAddress(req.user.id, address_id)
  }

  @ApiBearerAuth()
  @Patch('addresses')
  updateUserAddress(
    @Body() body: UpdateUserAddressInput,
    @Request() req: RequestWithUser
  ) {
    return this.service.updateUserAddress(req.user.id, body)
  }
}
