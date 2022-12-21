// https://stackoverflow.com/questions/58343262/class-validator-validate-array-of-objects

import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Address, AddressType, Role, User } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator'

import { IsUnique } from 'src/infra/utils/custom-class-validator'

export type UserOmittedPassword = Omit<User, 'password'>

const regex = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/
const regexMsg =
  '$property must contain at least 6 characters, 1 upper and 1 lower case letter, 1 number and special characters !#$%&?'

export class CreateUserInput
  implements Omit<User, 'id' | 'roles' | 'permissions' | 'created_at' | 'updated_at'>
{
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @Length(5, 40)
  name: string

  @ApiProperty({ example: 'john-doe@email.com' })
  @IsEmail()
  @IsUnique({ model: 'User' })
  email: string

  @ApiProperty({ example: 'Pwd@123!', writeOnly: true })
  @IsString()
  @Length(6, 30)
  @Matches(regex, { message: regexMsg })
  password: string
}

export class UpdateUserInput extends PartialType(CreateUserInput) {
  // @ApiProperty({ example: 'the user uuid is required' })
  // @IsUUID()
  // id: string
  // received by request headers

  @ApiProperty({
    example: 'Pwd@123!',
    description: 'required to update email or password',
  })
  @IsString()
  @ValidateIf(user => !!user.email || !!user.password)
  current_password: string
}

export class UpdateUserAccessLevelInput
  implements Pick<User, 'roles' | 'permissions'>
{
  @ApiProperty({
    example: [Role.CLIENT],
    enum: Role,
    description: 'The roles of an user',
  })
  @IsEnum(Role, { each: true })
  @ValidateIf(user => !!user.roles)
  roles: Role[]
  // https://www.autoscripts.net/typescript-class-validator-validate-enum-array/

  @ApiProperty({ example: ['user.create', 'user.update'] })
  @IsString({ each: true })
  @ValidateIf(user => !!user.permissions)
  permissions: string[]
}

export class CreateUserAddressInput
  implements Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>
{
  @ApiProperty({
    example: AddressType.SHIPPING,
    enum: AddressType,
    description: 'The type of an address',
  })
  @IsEnum(AddressType)
  type: AddressType

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  full_name: string

  @ApiProperty({ example: '(54) 9 9123-4567' })
  @IsString()
  phone: string

  @ApiProperty({ example: '99500-000' })
  @IsString()
  postal_code: string

  @ApiProperty({ example: 'Brasil' })
  @IsString()
  country: string

  @ApiProperty({ example: 'RS' })
  @IsString()
  state: string

  @ApiProperty({ example: 'Carazinho' })
  @IsString()
  city: string

  @ApiProperty({ example: 'Conceição' })
  @IsString()
  neighborhood: string

  @ApiProperty({ example: 'Rua Parecis' })
  @IsString()
  street: string

  @ApiProperty({ example: '320' })
  @IsString()
  number: string

  @ApiProperty({ example: 'Em frente a VM Pneus' })
  @IsString()
  complement: string
}

export class UpdateUserAddressInput extends PartialType(CreateUserAddressInput) {
  @ApiProperty({ example: 'the address uuid is required' })
  @IsUUID()
  id: string
}
