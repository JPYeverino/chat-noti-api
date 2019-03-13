import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './models/conversation.model';
import { ModelType } from 'typegoose';
import { QuotesService } from 'src/services/quotes/quotes.service';
import { BaseService } from 'src/shared/base.service';
import { ConversationVm } from './models/view-models/conversation-vm.model';
import { UserVm } from 'src/user/models/view-models/user-vm.model';
import { AddContactVm } from 'src/user/models/view-models/add-contact-vm.model';
import { AppGateway } from 'src/app.gateway';
import { userInfo } from 'os';
import { ConvObject } from './models/view-models/conv-object.model';

@Injectable()
export class ConversationService extends BaseService<Conversation> {
    constructor(
        @InjectModel(Conversation.modelName) private readonly _cnvModel: ModelType<Conversation>,
        private readonly _authService: QuotesService,
        private readonly _gateway: AppGateway
    ) {
        super();
        this._model = _cnvModel;
    }

    async newConversation(req: Express.Request, user?: AddContactVm, users?: AddContactVm[]) {
        let participant;
        try {
            participant = await this._authService.authHttp(req);
        } catch (e) {
            throw new HttpException('unauthorized', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const participants = await this._authService.getUser([participant.id, user.toAddContact]);

        const newConversation = new this._model({
            participants: [...participants.data]
        });

        try {
            const result = await this.create(newConversation);
            return result.toJSON() as Conversation;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getConversation(id: string, req) {
        let participant;
        try {
            participant = await this._authService.authHttp(req);
        } catch (e) {
            throw new HttpException('unauthorized', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            const result = await this.findById(id);
            this._gateway.io.on('connection', socket => {
                socket.join(result.id);
            });

            return result;
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserConversations(req) {
        let user;
        try {
            user = await this._authService.authHttp(req);
        } catch (e) {
            throw new HttpException('unauthorized', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const conversations = await this._model.find({ 'participants._id': user.id }, { 'participants.updatedAt': 0, 'participants.createdAt': 0, 'participants._id': 0, 'participants.__v': 0 })
        conversations.map(conversation => {
            conversation.participants
                .splice(conversation.participants
                    .findIndex(el => {
                        return el.id === user.id
                    }), 1);
        });
        conversations.forEach(conversation => {
            this._gateway.io.on('connection', socket => {
                socket.join(conversation.id);
            });
        });
        return conversations;
    }
}
