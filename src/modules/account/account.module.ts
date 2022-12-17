import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { TokenModule } from './token/token.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, TokenModule, UserModule],
})
export class AccountModule {}
