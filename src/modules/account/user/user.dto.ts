// https://stackoverflow.com/questions/58343262/class-validator-validate-array-of-objects

import { ApiProperty, PartialType } from '@nestjs/swagger'
import type { Role, User } from '@prisma/client'
import {
  IsEmail,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator'

import { IsUnique } from 'src/infra/utils/custom-class-validator'

const regex = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/
const regexMsg =
  '$property must contain at least 6 characters, 1 upper and 1 lower case letter, 1 number and special characters !#$%&?'

export class CreateUserBody
  implements Omit<User, 'id' | 'created_at' | 'updated_at'>
{
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(5, 40)
  name: string

  @ApiProperty({ example: 'john-doe@email.com' })
  @IsEmail()
  @IsUnique({ model: 'User' })
  email: string

  @ApiProperty({ example: 'Abc-123!' })
  @IsString()
  @Length(6, 30)
  @Matches(regex, { message: regexMsg })
  password: string

  @ApiProperty({ example: ['CLIENT'] })
  @IsString({ each: true })
  roles: Role[]

  @ApiProperty({ example: ['user.create', 'user.update'] })
  @IsString({ each: true })
  permissions: string[]
}

export class UpdateUserBody extends PartialType(CreateUserBody) {
  @IsUUID()
  id: string

  @IsString()
  @ValidateIf(user => !!user.email || !!user.password)
  currentPassword: string
}
