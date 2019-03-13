import { Controller, Get, Req, HttpException, HttpStatus, Res, Body, Post, Query } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Message } from './models/message.model';
import { MessageService } from './message.service';
import { QuotesService } from 'src/services/quotes/quotes.service';
import { map } from 'rxjs/operators';
import { MessageVm } from './models/view-models/message-vm.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { apiException } from 'src/shared/api-exception.model';
import { GetConversationsVm } from './models/view-models/get-conversations-vm.model';

@Controller('message')
@ApiUseTags(Message.modelName)
export class MessageController {
    constructor(
        private readonly _messageService: MessageService,
    ) { }

    @Post()
    @ApiCreatedResponse({ type: MessageVm})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(Message.modelName, 'new message'))
    async newMessage(@Body() message: MessageVm, @Req() req): Promise<any> {
        const {content, conversation} = message;
        if(!content) {
            throw new HttpException('Content is required', HttpStatus.BAD_REQUEST);
        }
        const newMessage = await this._messageService.newMessage(req, message);
        return newMessage;
    }

    @Get()
    @ApiOkResponse({ type: MessageVm, isArray: true})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(Message.modelName, 'conversations messages'))
    async conversationMessages(@Query('conv') conversation: string, @Req() req) {
        return this._messageService.getMessagesByConversation(conversation, req);
    }
}
