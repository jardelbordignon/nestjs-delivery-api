// https://stackoverflow.com/questions/58343262/class-validator-validate-array-of-objects

import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Delivery } from '@prisma/client'
import { IsString, Length } from 'class-validator'

export class CreateDeliveryInput implements Pick<Delivery, 'title' | 'description'> {
  @ApiProperty({
    description: 'The delivery title',
    example: 'From the office to the airport',
  })
  @IsString()
  @Length(10, 200)
  title: string

  @ApiProperty({
    description: 'The delivery description',
    example: 'Pick up a document from the office and deliver it at the airport',
  })
  @IsString()
  @Length(10, 200)
  description: string
}

export class UpdateDeliveryInput extends PartialType(CreateDeliveryInput) {}
