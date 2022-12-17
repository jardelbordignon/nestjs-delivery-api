import type { Token } from '@prisma/client'
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateTokenInput implements Omit<Token, 'id'> {
  @IsUUID()
  @IsNotEmpty()
  user_id: string

  @IsString()
  @IsNotEmpty()
  refresh_token: string

  @IsDate()
  @IsNotEmpty()
  expires_at: Date
}
