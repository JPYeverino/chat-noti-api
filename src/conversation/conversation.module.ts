import { Module, HttpModule } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { QuotesService } from '../services/quotes/quotes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation } from './models/conversation.model';
import { ConversationGateway } from './conversation.gateway';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: Conversation.modelName, schema: Conversation.model.schema}]), ],
  controllers: [ConversationController],
  providers: [ConversationService, QuotesService, ConversationGateway,]
})
export class ConversationModule {}
