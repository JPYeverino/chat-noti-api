import { Controller, Post, Body, Get, Req, Query, HttpStatus } from '@nestjs/common';
import { ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiImplicitQuery } from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { UserVm } from './models/view-models/user-vm.model';
import { apiException } from '../shared/api-exception.model';
import { RegisterVm } from './models/view-models/register-vm';
import { AddContactVm } from './models/view-models/add-contact-vm.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
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
    async register(@Body() registerVm: RegisterVm): Promise<any> {
        console.log('Noti register test ',registerVm)
        try {
            const newUser = await this._userService.saveUser(registerVm);
            return newUser;
        } catch (e) {
            console.log(e);
            throw e;
        }
       
    }

    @Post('add-contact')
    @ApiCreatedResponse({ type: UserVm })
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
        console.log('contacts');
        return await this._userService.getContacts(req);
    }

    @Post('friend')
    @ApiCreatedResponse({ type: UserVm})
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'set contact status'))
    async makeFriends(@Req() req, @Body() contact: AddContactVm) {
        return this._userService.makeFriends(contact, req);
    }

    @Get('users-list')
    @ApiOkResponse({ type: UserVm, isArray: true })
    @ApiBadRequestResponse({ type: apiException })
    @ApiOperation(GetOperationId(User.modelName, 'users list'))
    @ApiImplicitQuery({ name: 'search', type: String, required: true, })
    async getFilteredUsers(@Req() req, @Query() searchInput: string) { 
        return await this._userService.getAll(req, searchInput);
    }
        


}
