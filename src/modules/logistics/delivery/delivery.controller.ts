import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Delivery, Role } from '@prisma/client'

import { AllowUnauthenticated, AuthorizationGuard } from 'src/infra/guards'
import { RequestWithUser } from 'src/types'

import { CreateDeliveryInput, UpdateDeliveryInput } from './delivery.dto'
import { DeliveryService } from './delivery.service'

@ApiTags('Logistics - Delivery')
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly service: DeliveryService) {}

  // @ApiOperation({ summary: 'Get all deliverys' })
  // @ApiResponse({ description: 'A list of deliveries' })
  // @HttpCode(HttpStatus.OK)
  // @Get()
  // findAll(): Promise<Delivery[]> {
  //   return this.service.findAll()
  // }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a delivery',
    description: 'A client create a delivery',
  })
  @ApiResponse({ description: 'The created delivery' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() body: CreateDeliveryInput,
    @Request() req: RequestWithUser
  ): Promise<Delivery> {
    return this.service.create(req.user.id, body)
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Take delivery',
    description: 'A deliveryman take a delivery',
  })
  @ApiResponse({ description: 'The updated delivery' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthorizationGuard({ roles: [Role.DELIVERYMAN] }))
  @Patch('take/:delivery_id')
  takeDelivery(
    @Param('delivery_id') delivery_id: string,
    @Request() req: RequestWithUser
  ): Promise<Delivery> {
    return this.service.takeDelivery(req.user.id, delivery_id)
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'End delivery',
    description: 'A deliveryman end a delivery',
  })
  @ApiResponse({ description: 'The ended delivery' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthorizationGuard({ roles: [Role.DELIVERYMAN] }))
  @Patch('end/:delivery_id')
  endDelivery(
    @Param('delivery_id') delivery_id: string,
    @Request() req: RequestWithUser
  ): Promise<Delivery> {
    return this.service.endDelivery(req.user.id, delivery_id)
  }
}
