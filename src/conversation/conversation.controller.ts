import { Controller, Post, HttpStatus, Req, Body, Get, Query } from '@nestjs/common';
import { ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse, ApiResponse, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Conversation } from './models/conversation.model';
import { ConversationService } from './conversation.service';
import { ConversationVm } from './models/view-models/conversation-vm.model';
import { apiException } from 'src/shared/api-exception.model';
import { UserVm } from 'src/user/models/view-models/user-vm.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { AddContactVm } from 'src/user/models/view-models/add-contact-vm.model';

@Controller('conversation')
@ApiUseTags(Conversation.modelName)
export class ConversationController {
    constructor (
        private readonly _cnvService: ConversationService
    ) { }

    @Post()
    @ApiCreatedResponse({type: ConversationVm})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: apiException})
    @ApiOperation(GetOperationId(Conversation.modelName, 'new conversation'))
    async newConversation(@Req() req, @Body() user: AddContactVm): Promise<Conversation> {
        return this._cnvService.newConversation(req, user);
    }

    @Get()
    @ApiOkResponse({type: ConversationVm})
    @ApiBadRequestResponse({type: apiException})
    @ApiOperation(GetOperationId(Conversation.modelName, 'get conversation'))
    async getConversation(@Req() req, @Query('id') id: string) {
        return this._cnvService.getConversation(id, req);
    }

    @Get('usersConversation')
    @ApiOkResponse({type: ConversationVm, isArray: true})
    @ApiBadRequestResponse({type: apiException})
    @ApiOperation(GetOperationId(Conversation.modelName, 'get users conversation'))
    async getUserConversations(@Req() req) {
        return this._cnvService.getUserConversations(req);
    }
    
}
