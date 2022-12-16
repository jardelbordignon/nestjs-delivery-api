import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from 'src/infra/prisma.service'

import { CreateUserBody } from './user.dto'

@Injectable()
export class UserService extends PrismaService {
  findAll(): Promise<User[]> {
    return this.user.findMany()
  }

  create(data: CreateUserBody) {
    return this.user.create({ data })
  }
}
