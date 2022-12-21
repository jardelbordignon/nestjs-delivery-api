import { Body, Controller, Delete, HttpStatus, Post, Request } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AllowUnauthenticated } from 'src/infra/guards'
import { RequestWithUser } from 'src/types'

import {
  LoginInput,
  RefreshTokenInput,
  ResetPasswordInput,
  SendPasswordResetEmailInput,
  TokensResponse,
} from './auth.dto'
import { LoginResponse } from './auth.dto'
import { AuthService } from './auth.service'

@ApiTags('Account - Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @AllowUnauthenticated()
  @ApiResponse({ type: LoginResponse, status: HttpStatus.CREATED })
  @Post()
  async login(@Body() body: LoginInput): Promise<LoginResponse> {
    return this.service.login(body)
  }

  @ApiBearerAuth()
  @Delete()
  async logout(@Request() req: RequestWithUser): Promise<boolean> {
    return this.service.logout(req.user.id)
  }

  @ApiBearerAuth()
  @Post('refresh_tokens')
  async refreshTokens(@Body() body: RefreshTokenInput): Promise<TokensResponse> {
    return this.service.refreshTokens(body.refresh_token)
  }

  @Post('reset_password')
  async resetPassword(@Body() body: ResetPasswordInput): Promise<boolean> {
    return this.service.resetPassword(body)
  }

  @Post('send_reset_password_email')
  async sendResetPasswordEmail(
    @Body() body: SendPasswordResetEmailInput
  ): Promise<boolean> {
    return this.service.sendResetPasswordEmail(body.email)
  }
}
