import { randomUUID } from 'node:crypto'
import { resolve } from 'path'

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'

import { TokenService } from '../token/token.service'
import type { UserOmittedPassword } from '../user/user.dto'
import { UserService } from '../user/user.service'

import { omitProperties } from 'src/infra/utils/omit-properties'

import {
  AuthenticatedUser,
  LoginInput,
  LoginResponse,
  RefreshTokenInput,
  ResetPasswordInput,
  TokensResponse,
} from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService //private mailProvider: IMailProvider
  ) {}

  async handleTokens(user_id: string): Promise<LoginResponse['tokens']> {
    const access_token = await this.jwtService.signAsync({ sub: user_id })

    const daysToExpire = +process.env.JWT_REFRESH_EXPIRES_IN_DAYS
    const refresh_token = await this.jwtService.signAsync(
      { sub: user_id },
      { expiresIn: `${daysToExpire}d` }
    )
    const expires_at = new Date(Date.now() + daysToExpire * 1000 * 60 * 60 * 24)
    await this.tokenService.create({ user_id, refresh_token, expires_at })
    return { access_token, refresh_token }
  }

  async logout(user_id: string): Promise<boolean> {
    return this.tokenService.deleteByUserId(user_id)
  }

  async login({ email, password }: LoginInput): Promise<LoginResponse> {
    const user = await this.userService.findFirstByEmailWithPassword(email)
    const match = await compare(password, user.password)
    if (!match) throw new NotFoundException('User not found')
    const isDeleted = await this.tokenService.deleteByUserId(user.id)
    if (!isDeleted) throw new ForbiddenException('Token existing')

    const tokens = await this.handleTokens(user.id)
    return {
      user: omitProperties(user, ['password']),
      tokens,
    }
  }

  async sendResetPasswordEmail(email: string): Promise<boolean> {
    const user = await this.userService.findFirstByEmailWithPassword(email)
    await this.logout(user.id)
    const refresh_token = randomUUID()
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 2) // two hours
    await this.tokenService.create({ user_id: user.id, refresh_token, expires_at })
    const templatePath = resolve(
      'dist',
      'account',
      'auth',
      'view',
      'forgotPassword.hbs'
    )
    const variables = {
      name: user.name,
      link: `http://localhost:3000/password/reset/${refresh_token}`,
    }

    console.log('email', email)
    console.log('variables', variables)
    console.log('templatePath', templatePath)
    // this.mailProvider.sendMail(
    //   email,
    //   'Recuperação de senha',
    //   variables,
    //   templatePath
    // )

    return true
  }

  async refreshTokens(data: RefreshTokenInput): Promise<TokensResponse> {
    const { sub } = await this.jwtService.verify(data.refresh_token)
    const token = await this.tokenService.findFirstByRefreshToken(data.refresh_token)
    if (!token) throw new UnauthorizedException('RefreshToken is invalid')
    await this.logout(sub)
    return this.handleTokens(sub)
  }

  async resetPassword({
    refresh_token,
    password,
  }: ResetPasswordInput): Promise<boolean> {
    const token = await this.tokenService.findFirstByRefreshToken(refresh_token)
    const isValidToken = token && new Date(token.expires_at) > new Date()
    if (!isValidToken) throw new UnauthorizedException('Token is invalid')
    await this.userService.resetPassword(token.user_id, password)
    this.logout(token.user_id)
    return true
  }

  async currentUser(
    authenticated_user: AuthenticatedUser
  ): Promise<UserOmittedPassword> {
    try {
      return this.userService.findFirstById(authenticated_user.id)
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
