import { Module, HttpModule } from '@nestjs/common';
import { NotiUserController } from './noti-user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { AppGateway } from 'src/app.gateway';
import { QuotesService } from 'src/services/quotes/quotes.service';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: User.modelName, schema: User.model.schema}]),], 
  controllers: [NotiUserController],
  providers: [UserService,  QuotesService, AppGateway]
})
export class UserModule {}
