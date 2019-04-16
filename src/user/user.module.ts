import { Module, HttpModule } from '@nestjs/common';
import { NotiUserController } from './noti-user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { QuotesService } from '../services/quotes/quotes.service';
import { UserGateway } from './user.gateway';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: User.modelName, schema: User.model.schema}]),], 
  controllers: [NotiUserController],
  providers: [UserService,  QuotesService, UserGateway,]
})
export class UserModule {}
