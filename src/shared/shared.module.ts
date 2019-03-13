import { Module, Global } from '@nestjs/common';
import { ConfigurationService } from './configuration/configuration.service';
import { MapperService } from './mapper/mapper.service';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';

@Global()
@Module({
  providers: [ConfigurationService, MapperService],
  exports: [ConfigurationService, MapperService],
  imports: [UserModule, MessageModule]
})
export class SharedModule {}
