import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import type { Address, User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'

import { PrismaService } from 'src/infra/prisma.service'
import { omitProperties } from 'src/infra/utils/omit-properties'

import {
  CreateUserAddressInput,
  CreateUserInput,
  UpdateUserAccessLevelInput,
  UpdateUserAddressInput,
  UpdateUserInput,
  type UserOmittedPassword,
} from './user.dto'

@Injectable()
export class UserService extends PrismaService {
  async create(data: CreateUserInput): Promise<UserOmittedPassword> {
    const { email, name, password } = data
    const hashedPassword = await hash(password, 10)
    const user = await this.user.create({
      data: { email, name, password: hashedPassword },
    })
    return omitProperties(user, ['password'])
  }

  async delete(id: string): Promise<boolean> {
    await this.findFirstWithPassword('id', id)
    const userDeleted = await this.user.delete({ where: { id } })
    return !!userDeleted
  }

  async findAll(): Promise<UserOmittedPassword[]> {
    const users = await this.user.findMany()
    const usersOmittedPassword = users.map(user => omitProperties(user, ['password']))
    return usersOmittedPassword
  }

  private async findFirst(field: string, value: any): Promise<UserOmittedPassword> {
    const user = await this.findFirstWithPassword(field, value)
    return omitProperties(user, ['password'])
  }

  private async findFirstWithPassword(field: string, value: any): Promise<User> {
    const user = await this.user.findFirst({ where: { [field]: value } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findFirstByEmailWithPassword(email: string): Promise<User> {
    return this.findFirstWithPassword('email', email)
  }

  async findFirstById(id: string): Promise<UserOmittedPassword> {
    return this.findFirst('id', id)
  }

  async resetPassword(id: string, password: string): Promise<User> {
    await this.findFirstWithPassword('id', id)
    password = await hash(password, 10)
    return this.user.update({ where: { id }, data: { password } })
  }

  async update(id: string, data: UpdateUserInput): Promise<UserOmittedPassword> {
    const { email, name, current_password, password } = data
    const user = await this.user.findFirst({ where: { id } })
    if (email || password) {
      const match = await compare(current_password, user.password)
      if (!match) throw new UnauthorizedException('Incorrect current password')
    }
    const updatedUser = await this.user.update({
      where: { id },
      data: { email, name, password },
    })
    return omitProperties(updatedUser, ['password'])
  }

  async updateAccessLevel(
    id: string,
    data: UpdateUserAccessLevelInput
  ): Promise<UserOmittedPassword> {
    const { permissions, roles } = data
    const updatedUser = await this.user.update({
      where: { id },
      data: { permissions, roles },
    })
    return omitProperties(updatedUser, ['password'])
  }

  // User Addresses
  async findUserAddresses(user_id: string): Promise<Address[]> {
    return this.address.findMany({ where: { user_id } })
  }

  async findUserAddress(user_id: string, address_id: string): Promise<Address> {
    return this.address.findFirst({ where: { user_id, id: address_id } })
  }

  async createUserAddress(
    user_id: string,
    data: CreateUserAddressInput
  ): Promise<Address> {
    const {
      city,
      complement,
      country,
      full_name,
      neighborhood,
      number,
      phone,
      postal_code,
      state,
      street,
      type,
    } = data
    const alreadyExists = await this.address.findFirst({
      where: { user_id, street, number },
    })
    if (alreadyExists) throw new BadRequestException('Address already exists')
    const address = await this.address.create({
      data: {
        user_id,
        city,
        complement,
        country,
        full_name,
        neighborhood,
        number,
        phone,
        postal_code,
        state,
        street,
        type,
      },
    })
    return address
  }

  async deleteUserAddress(user_id: string, id: string): Promise<boolean> {
    const address = await this.address.findFirst({ where: { user_id, id } })
    if (address) {
      const deletedAddress = await this.address.delete({ where: { id } })
      return !!deletedAddress
    }
    return true
  }

  async updateUserAddress(
    user_id: string,
    data: UpdateUserAddressInput
  ): Promise<Address> {
    const {
      id,
      city,
      complement,
      country,
      full_name,
      neighborhood,
      number,
      phone,
      postal_code,
      state,
      street,
      type,
    } = data
    const addressExists = await this.address.findFirst({ where: { user_id, id } })
    if (!addressExists) throw new NotFoundException('Address not found')
    const updatedAddress = this.address.update({
      where: { id },
      data: {
        city,
        complement,
        country,
        full_name,
        neighborhood,
        number,
        phone,
        postal_code,
        state,
        street,
        type,
      },
    })
    return updatedAddress
  }
}
