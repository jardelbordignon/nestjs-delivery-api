/* eslint-disable @typescript-eslint/ban-types */
import { Module } from '@nestjs/common'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'

import { PrismaService } from '../prisma.service'

type Props = ValidationOptions & {
  table: string
  field?: string
}

@ValidatorConstraint({ async: true })
class isExistingValidator
  extends PrismaService
  implements ValidatorConstraintInterface
{
  async validate(_: any, args: ValidationArguments) {
    const { property, value, constraints } = args
    const { table, field, reverse } = constraints[0]

    const fieldName = field || property

    // console.log('table', table)
    // console.log('field', fieldName)
    // console.log('value', value)
    // console.log('reverse', reverse)

    const register = await this[table].findFirst({ where: { [fieldName]: value } })
    //console.log('register', register)

    return reverse ? !register : !!register
  }
}

export function IsExisting({ table, field, ...rest }: Props) {
  const options = rest || {}

  if (!options.message) {
    Object.assign(options, { message: "$property '$value' not exists" })
  }

  const data = { table, field, reverse: false }

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [data],
      validator: isExistingValidator,
    })
  }
}

export function IsUnique({ table, field, ...rest }: Props) {
  const options = rest || {}

  if (!options.message) {
    Object.assign(options, { message: "$property '$value' already exists" })
  }

  const data = { table, field, reverse: true }

  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [data],
      validator: isExistingValidator,
    })
  }
}

@Module({
  providers: [isExistingValidator],
})
export class CustomClassValidatorModule {}
