import { Module, HttpModule } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { QuotesService } from 'src/services/quotes/quotes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation } from './models/conversation.model';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: Conversation.modelName, schema: Conversation.model.schema}]), ],
  controllers: [ConversationController],
  providers: [ConversationService, QuotesService, AppGateway]
})
export class ConversationModule {}
