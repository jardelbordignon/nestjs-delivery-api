import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import {
  LoginInput,
  RefreshTokenInput,
  ResetPasswordInput,
  SendPasswordResetEmailInput,
  TokensResponse,
} from './auth.dto'
import { LoginResponse } from './auth.dto'
import { AuthService } from './auth.service'

@ApiBearerAuth()
@ApiTags('Account - Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  async login(@Body() data: LoginInput): Promise<LoginResponse> {
    return this.service.login(data)
  }

  @Delete(':user_id')
  async logout(@Param('user_id') user_id: string): Promise<boolean> {
    return this.service.logout(user_id)
  }

  @Post('refresh_tokens')
  async refreshTokens(@Body() data: RefreshTokenInput): Promise<TokensResponse> {
    return this.service.refreshTokens(data)
  }

  @Post('reset_password')
  async resetPassword(@Body() data: ResetPasswordInput): Promise<boolean> {
    return this.service.resetPassword(data)
  }

  @Post('send_reset_password_email')
  async sendResetPasswordEmail(
    @Body() data: SendPasswordResetEmailInput
  ): Promise<boolean> {
    return this.service.sendResetPasswordEmail(data.email)
  }
}
