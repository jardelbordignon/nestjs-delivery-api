import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import helmet from 'helmet'

//import { LoggerMiddleware } from 'src/infra/middlewares'
import { Modules } from 'src/modules/modules.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot({
      limit: 3,
      ttl: 10, // time to live
    }),
    Modules,
  ],
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
