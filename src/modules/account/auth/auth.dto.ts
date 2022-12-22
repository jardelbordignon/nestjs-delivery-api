import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsJWT, IsString, IsUUID, Length, Matches } from 'class-validator'

import { UserOmittedPassword } from '../user/user.dto'

export type AuthenticatedUser = Pick<UserOmittedPassword, 'id' | 'email'>

export type JwtPayload = {
  sub: string
  email: string
}

export type UserContext = {
  req: {
    user: AuthenticatedUser
  }
}

const regex = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$/
const regexMsg =
  '$property must contain at least 6 characters, 1 upper and 1 lower case letter, 1 number and special characters !#$%&?'

export class TokensResponse {
  @ApiProperty({ example: 'new-jwt-access-token' })
  access_token: string

  @ApiProperty({ example: 'new-jwt-refresh-token' })
  refresh_token: string
}

export class LoginResponse {
  user: UserOmittedPassword
  tokens: TokensResponse
}

export class LoginInput {
  @ApiProperty({ example: 'john@email.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Pwd@123!' })
  @IsString()
  password: string
}

export class LogoutInput {
  @ApiProperty({ example: 'a2c2c990-3ef5-4f14-8869-7fc28e0aff64' })
  @IsUUID()
  user_id: string
}

export class SendPasswordResetEmailInput {
  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  email: string
}

export class RefreshTokenInput {
  @ApiProperty({ example: 'the-current-jwt-refresh-token' })
  @IsJWT()
  refresh_token: string
}

export class ResetPasswordInput {
  @ApiProperty({ example: 'a2c2c990-3ef5-4f14-8869-7fc28e0aff64' })
  @IsUUID()
  refresh_token: string

  @ApiProperty({ example: 'Pwd@123!', writeOnly: true })
  @IsString()
  @Length(6, 30)
  @Matches(regex, { message: regexMsg })
  password: string
}
