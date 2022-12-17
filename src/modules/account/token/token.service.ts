import { Injectable } from '@nestjs/common'
import type { Token } from '@prisma/client'

import { PrismaService } from 'src/infra/prisma.service'

import { CreateTokenInput } from './token.dto'

@Injectable()
export class TokenService extends PrismaService {
  async create(data: CreateTokenInput): Promise<Token> {
    return this.token.create({ data })
  }

  async deleteByUserId(user_id: string): Promise<boolean> {
    const exists = await this.token.findFirst({ where: { user_id } })
    if (!exists) return true
    const deletedToken = await this.token.delete({ where: { user_id } })
    return !!deletedToken
  }

  async findFirstByRefreshToken(refresh_token: string): Promise<Token> {
    return this.token.findFirst({ where: { refresh_token } })
  }
}
