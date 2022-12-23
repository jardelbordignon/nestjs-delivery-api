import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Delivery } from '@prisma/client'

import { PrismaService } from 'src/infra/prisma.service'

import { CreateDeliveryInput } from './delivery.dto'

@Injectable()
export class DeliveryService extends PrismaService {
  async create(client_id: string, data: CreateDeliveryInput): Promise<Delivery> {
    const { description, title } = data
    return this.delivery.create({ data: { client_id, description, title } })
  }

  async takeDelivery(user_id: string, id: string): Promise<Delivery> {
    const user = await this.user.findFirst({
      where: { id: user_id },
      include: { deliveryman: true },
    })

    await this.deliveryman.update({
      where: { id: user.deliveryman.id },
      data: { available: false },
    })

    return this.delivery.update({
      where: { id },
      data: { deliveryman_id: user.deliveryman.id },
    })
  }

  async endDelivery(user_id: string, id: string): Promise<Delivery> {
    const user = await this.user.findFirst({
      where: { id: user_id },
      include: { deliveryman: true },
    })

    await this.deliveryman.update({
      where: { id: user.deliveryman.id },
      data: { available: true },
    })

    return this.delivery.update({
      where: { id },
      data: { delivered_at: new Date() },
    })
  }
}
