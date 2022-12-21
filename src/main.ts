import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'

import { AppModule } from './app/app.module'
import { AuthenticationGuard } from './infra/guards'

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ allowedHeaders: '*', origin: '*' })

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalGuards(new AuthenticationGuard(app.get(Reflector)))

  const config = new DocumentBuilder()
    .setTitle('Delivery')
    .setDescription('The Delivery API Documentation')
    .setVersion('0.1')
    .build()

  const swaggerOpts = {
    swaggerOptions: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  }

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document, swaggerOpts)

  const logger = new Logger('Bootstrap')

  await app.listen(PORT).then(async () => {
    logger.log(`🚀 Server is running on: ${await app.getUrl()}`)
  })
}
bootstrap()
