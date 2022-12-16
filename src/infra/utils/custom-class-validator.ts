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
  model: string
  property?: string
}

@ValidatorConstraint({ async: true })
class isExistingValidator
  extends PrismaService
  implements ValidatorConstraintInterface
{
  async validate(_: any, args: ValidationArguments) {
    const { property, value, constraints } = args
    const { model, field, reverse } = constraints[0]

    const propertyName = field || property

    // console.log('model', model)
    // console.log('property', propertyName)
    // console.log('value', value)
    // console.log('reverse', reverse)

    const register = await this[model].findFirst({ where: { [propertyName]: value } })
    //console.log('register', register)

    return reverse ? !register : !!register
  }
}

export function IsExisting({ model, property, ...rest }: Props) {
  const options = rest || {}

  if (!options.message) {
    Object.assign(options, { message: "$property '$value' not exists" })
  }

  const data = { model, field: property, reverse: false }

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

export function IsUnique({ model, property, ...rest }: Props) {
  const options = rest || {}

  if (!options.message) {
    Object.assign(options, { message: "$property '$value' already exists" })
  }

  const data = { model, field: property, reverse: true }

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
