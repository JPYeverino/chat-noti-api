import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { QuotesService } from './services/quotes/quotes.service';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { MessageController } from './message/message.controller';
import { NotiUserController } from './user/noti-user.controller';
import { ConversationController } from './conversation/conversation.controller';


@Module({
  imports: [SharedModule, HttpModule, MongooseModule.forRootAsync({
    imports: [SharedModule],
    useFactory: async(_configService: ConfigurationService) => ({
      uri: _configService.get(Configuration.MONGO_URI),
      retryDelay: 500,
      retryAttempts: 3,
      useNewUrlParser: true,
      useCreateIndex: true
    }),
    inject: [ConfigurationService]
  }), UserModule, ConversationModule, MessageModule,],
  controllers: [AppController],
  providers: [AppService, QuotesService,],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieParserMiddleware)
      .forRoutes(AppController, MessageController, NotiUserController, ConversationController);
  }

  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT));
    AppModule.host = _configurationService.get(Configuration.HOST);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  private static normalizePort(param: number | string): number | string {
    const portNumber: number = typeof param === 'string' ? parseInt(param,10) : param;
    if(isNaN(portNumber)) return param;
    else if (portNumber >= 0) return portNumber;
  }
}
