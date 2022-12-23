import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app/app.module'
import { mainConfig } from './main.config'

const PORT = 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  mainConfig(app)

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
