import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  const logger = new Logger('Bootstrap')

  await app.listen(PORT).then(() => {
    logger.log(`🚀 Server started on port ${PORT}`)
  })
}
bootstrap()
