import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { Message } from './models/message.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MessageVm } from './models/view-models/message-vm.model';
import { QuotesService } from 'src/services/quotes/quotes.service';
import { map } from 'rxjs/operators';
import { ObjectID, ObjectId } from 'bson';
import { AppGateway } from 'src/app.gateway';
import { Types } from 'mongoose';
import { GetConversationsVm } from './models/view-models/get-conversations-vm.model';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService extends BaseService<Message> {
    constructor(
        @InjectModel(Message.modelName) private readonly _msgModel: ModelType<Message>,
        private readonly _authService: QuotesService,
        private readonly _gateway: AppGateway
    ) {
        super();
        this._model = _msgModel;
    }

    async newMessage(request, messageVm: MessageVm) { 
        let author;
        try {
            author = await this._authService.authHttp(request);
        } catch (e) {
            throw new HttpException('unauthorized', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const { content, conversation, seen} = messageVm;
        const authorInfo = await this._authService.getUser([author.id]);
        const newMessage = new this._model();
        newMessage.content = content;
        newMessage.author = authorInfo.data[0].username;
        newMessage.conversation = new Types.ObjectId(conversation);
        newMessage.seen = seen;

        try {
            const result = await this.create(newMessage);
            this._gateway.io.to(newMessage.conversation).emit('newUser', {"conversation":conversation});
            return result.toJSON() as Message;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMessagesByConversation(conversation: string, req: Express.Request) { 
        try {
            await this._authService.authHttp(req);
        } catch (e) {
            throw new HttpException('unauthorized', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            const result = await this.findAll({conversation: conversation});
            return result;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
