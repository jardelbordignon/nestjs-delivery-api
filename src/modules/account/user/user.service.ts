import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from 'src/infra/prisma.service'
import { omitProperties } from 'src/infra/utils/omit-properties'

import { CreateUserBody, UpdateUserBody } from './user.dto'

export type UserOmittedPassword = Omit<User, 'password'>
@Injectable()
export class UserService extends PrismaService {
  async findAll(): Promise<UserOmittedPassword[]> {
    const users = await this.user.findMany()

    const usersOmittedPassword = users.map(user => omitProperties(user, ['password']))

    return usersOmittedPassword
  }

  async create(data: CreateUserBody): Promise<UserOmittedPassword> {
    const user = await this.user.create({ data })
    return omitProperties(user, ['password'])
  }

  async update(loggedId: string, data: UpdateUserBody): Promise<UserOmittedPassword> {
    const { id, email, name, currentPassword, password, permissions, roles } = data
    if (loggedId !== id) throw new UnauthorizedException("Another user's profile")

    const user = await this.user.findFirst({ where: { id } })

    if (email || password) {
      const passwordsMatch = currentPassword === user.password
      if (!passwordsMatch)
        throw new UnauthorizedException('Incorrect current password')
    }

    const updatedUser = await this.user.update({
      where: { id },
      data: { email, name, password, permissions, roles },
    })
    return omitProperties(updatedUser, ['password'])
  }
}
