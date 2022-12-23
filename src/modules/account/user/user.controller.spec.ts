// https://stackoverflow.com/questions/58843038/how-to-manually-test-input-validation-with-nestjs-and-class-validator

import { Test, TestingModule } from '@nestjs/testing'
import { Role } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { AuthenticationGuard } from 'src/infra/guards'
import { RequestWithUser } from 'src/types'

import { UserController } from './user.controller'
import {
  CreateUserInput,
  UpdateUserAccessLevelInput,
  UpdateUserInput,
  UserOmittedPassword,
} from './user.dto'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController
  let service: UserService
  let user: UserOmittedPassword

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: AuthenticationGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)

    await service.user.deleteMany()

    user = await controller.create({
      name: 'John Doe',
      email: 'john-doe@email.com',
      password: 'Pwd@123!',
    })
  })

  // describe('init tests', () => {
  //   it('should ensure the AuthenticationGuard is applied to the controller', async () => {
  //     const guards = Reflect.getMetadata('__guards__', controller)
  //     const guard = guards[0]

  //     expect(new guard()).toBeInstanceOf(AuthenticationGuard)
  //   })
  // })

  describe('create', () => {
    it('should be able to create an user', async () => {
      const userData = {
        name: 'Jessie Lee',
        email: 'jessie-lee@email.com',
        password: 'Pwd@123!',
      }

      const errors = await validate(plainToInstance(CreateUserInput, userData))
      expect(errors.length).toBe(0)

      const jessie = await controller.create(userData)
      expect(jessie.id).toBeDefined()

      const users = await controller.findAll()
      expect(users.length).toBe(2)
    })

    it('should not be able to create an user with invalid data', async () => {
      const userData = { name: 'J', email: 'john-doe', password: 'P' }
      const errors = await validate(plainToInstance(CreateUserInput, userData))

      expect(errors.length).not.toBe(0)
      const strErrors = JSON.stringify(errors)
      expect(strErrors).toContain('name must be longer than or equal to 5 characters')
      expect(strErrors).toContain('email must be an email')
      expect(strErrors).toContain(
        'password must contain at least 6 characters, 1 upper and 1 lower case letter, 1 number and special characters !#$%&?'
      )
    })

    it('should not be able to create an user with an existing email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john-doe@email.com',
        password: 'Pwd@123!',
      }

      const errors = await validate(plainToInstance(CreateUserInput, userData))
      expect(errors.length).toBe(1)
      expect(JSON.stringify(errors)).toContain(
        'email john-doe@email.com already exists'
      )
    })
  })

  describe('update', () => {
    it('should be able to update an user', async () => {
      const userData = { name: 'John Doe Updated' }
      const errors = await validate(plainToInstance(UpdateUserInput, userData))
      expect(errors.length).toBe(0)

      const req = { user: { id: user.id } } as RequestWithUser
      const userUpdated = await controller.update(userData, req)
      expect(userUpdated.name).toBe('John Doe Updated')
    })

    it('should be able to update an user password and email', async () => {
      const userData = {
        email: 'john-doe-updated@email.com',
        password: 'Pwd@123!-updated',
        current_password: 'Pwd@123!',
      }
      const errors = await validate(plainToInstance(UpdateUserInput, userData))

      expect(errors.length).toBe(0)

      const req = { user: { id: user.id } } as RequestWithUser
      const userUpdated = await controller.update(userData, req)
      expect(userUpdated.email).toBe('john-doe-updated@email.com')
    })

    it('should not be able to update an user password or email without current_password', async () => {
      const userData = { email: 'john-doe-updated@email.com' }
      const errors = await validate(plainToInstance(UpdateUserInput, userData))
      expect(errors.length).toBe(1)
      expect(JSON.stringify(errors)).toContain('current_password must be a string')
    })
  })

  describe('update access level', () => {
    it('should be able to update an user access level', async () => {
      const userData = {
        roles: [Role.ADMIN, Role.CLIENT],
        permissions: ['user.delete'],
      }
      const errors = await validate(
        plainToInstance(UpdateUserAccessLevelInput, userData)
      )
      expect(errors.length).toBe(0)

      const req = { user: { id: user.id } } as RequestWithUser
      const userUpdated = await controller.updateAccessLevel(userData, req)
      expect(userUpdated.roles).toStrictEqual([Role.ADMIN, Role.CLIENT])
      expect(userUpdated.permissions).toStrictEqual(['user.delete'])
    })

    it('should not be able to update an user access level with an invalid role', async () => {
      const userData = { roles: ['BANANA'], permissions: 'Apple' }
      const errors = await validate(
        plainToInstance(UpdateUserAccessLevelInput, userData)
      )
      console.log('Errors', JSON.stringify(errors))
      expect(errors.length).toBe(1)
      expect(JSON.stringify(errors)).toContain(
        'each value in roles must be one of the following values: ADMIN, DELIVERYMAN, CLIENT'
      )
      // const req = { user: { id: user.id } } as RequestWithUser
      // const userUpdated = await controller.updateAccessLevel(userData, req)
      // expect(userUpdated.roles).toStrictEqual([Role.ADMIN, Role.CLIENT])
      // expect(userUpdated.permissions).toStrictEqual(['user.delete'])
    })
  })
})
