import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from 'src/infra/prisma.service'
import { omitProperties } from 'src/infra/utils/omit-properties'

import { CreateUserBody } from './user.dto'

export type UserOmittedPassword = Omit<User, 'password'>
@Injectable()
export class UserService extends PrismaService {
  async findAll(): Promise<UserOmittedPassword[]> {
    const users = await this.user.findMany()

    const usersOmittedPassword = users.map(user => omitProperties(user, ['password']))

    return usersOmittedPassword
  }

  create(data: CreateUserBody) {
    return this.user.create({ data })
  }
}
