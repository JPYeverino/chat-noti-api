import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserVm } from './models/view-models/user-vm.model';
import { apiException } from 'src/shared/api-exception.model';
import { RegisterVm } from './models/view-models/register-vm';
import { AddContactVm } from './models/view-models/add-contact-vm.model';
import { IoAdapter } from '@nestjs/websockets';
import { AppGateway } from 'src/app.gateway';
import { Types } from 'mongoose';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { ConversationVm } from 'src/conversation/models/view-models/conversation-vm.model';
import { userContact } from './models/view-models/user-contacts.model';

@Controller('noti-user')
@ApiUseTags(User.modelName)
export class NotiUserController {
    constructor(
        private readonly _userService: UserService,
    ) { }

    @Get('getall')
    @ApiOkResponse({ type: userContact, isArray: true })
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'get all'))
    async getAll(): Promise<any> {
        return await this._userService.findAll();
    }

    @Post('save-user')
    @ApiCreatedResponse({ type: userContact })
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'save user'))
    async register(@Body() registerVm: RegisterVm, @Req() request): Promise<any> {
        const newUser = await this._userService.saveUser(registerVm);
        return newUser;
    }

    @Post('add-contact')
    @ApiCreatedResponse({ type: AddContactVm })
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'add contact'))
    async addContact(@Body() addContact: AddContactVm, @Req() req) {

        const result = await this._userService.addContact(addContact, req);
        return result;
    }

    @Get('allContacts')
    @ApiOkResponse({ type: UserVm, isArray: true })
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'get user contacts'))
    async getUserContacts(@Req() req) {
        return await this._userService.getContacts(req);
    }

    @Post('friend')
    @ApiOkResponse({ type: AddContactVm})
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'set contact status'))
    async makeFriends(@Req() req, @Body() contact: AddContactVm) {

        return this._userService.makeFriends(contact, req);

    }

}
