import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import helmet from 'helmet'

//import { LoggerMiddleware } from 'src/infra/middlewares'
import { Modules } from 'src/modules/modules.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [Modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes('*')
    // if (env.name !== 'development') return
    //consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
