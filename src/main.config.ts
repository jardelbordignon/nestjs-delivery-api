import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AuthenticationGuard } from './infra/guards'

export function mainConfig(app: INestApplication) {
  app.enableCors({ allowedHeaders: '*', origin: '*' })
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalGuards(new AuthenticationGuard(app.get(Reflector)))
}
