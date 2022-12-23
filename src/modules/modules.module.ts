import { Module } from '@nestjs/common'

import { AccountModule } from './account/account.module'
import { LogisticsModules } from './logistics/logistics.module'

@Module({
  imports: [AccountModule, LogisticsModules],
})
export class Modules {}
