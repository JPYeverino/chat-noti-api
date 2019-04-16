import { Module, HttpModule } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './models/message.model';
import { QuotesService } from '../services/quotes/quotes.service';
import { MessageGateway } from './message.gateway';

@Module({
  imports:[HttpModule, MongooseModule.forFeature([{name: Message.modelName, schema: Message.model.schema}]), ],
  controllers: [MessageController],
  providers: [MessageService, QuotesService, MessageGateway, ]
})
export class MessageModule {}
