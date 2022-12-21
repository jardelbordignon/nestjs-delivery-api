import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { TokenService } from '../token/token.service'
import { UserService } from '../user/user.service'

import { AuthController } from './auth.controller'
import { JwtStrategy } from './auth.jwt-strategy'
import { AuthService } from './auth.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, UserService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
