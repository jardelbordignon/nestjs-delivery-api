import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { useContainer } from 'class-validator'
import helmet from 'helmet'

import { AppModule } from './app/app.module'

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())
  app.enableCors({ allowedHeaders: '*', origin: '*' })

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.useGlobalPipes(new ValidationPipe())

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

  await app.listen(PORT).then(() => {
    logger.log(`🚀 Server started on port ${PORT}`)
  })
}
bootstrap()
