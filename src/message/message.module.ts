import { Module, HttpModule } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './models/message.model';
import { QuotesService } from 'src/services/quotes/quotes.service';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports:[HttpModule, MongooseModule.forFeature([{name: Message.modelName, schema: Message.model.schema}]), ],
  controllers: [MessageController],
  providers: [MessageService, QuotesService, AppGateway]
})
export class MessageModule {}
