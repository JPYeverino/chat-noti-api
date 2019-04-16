import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVm } from './models/view-models/register-vm';
import { Types } from 'mongoose';
import { AddContactVm } from './models/view-models/add-contact-vm.model';
import { QuotesService } from '../services/quotes/quotes.service';
import { map } from 'rxjs/operators';
import { ObjectId } from 'mongodb';
import { StatusEnum } from './models/status-enum.enum';
import { UserVm } from './models/view-models/user-vm.model';
import { type } from 'os';
import { UserGateway } from './user.gateway';


@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
    private readonly _mapperService: MapperService,
    private readonly _authService: QuotesService,
    private readonly _gateway: UserGateway
  ) {
    super();
    this._model = _userModel;
  }

  async saveUser(registerVm: RegisterVm) {
    const { _id } = registerVm;

    const newUser = new this._model();
    newUser._id = _id;
    console.log('save user test ', newUser);
    try {
        const result = await this.create(newUser);
        return result.toJSON() as User;
    } catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addContact(AddContact: AddContactVm, req: Express.Request) {
    const { toAddContact } = AddContact

    const _toAddContact = await this.findOne({ _id: new ObjectId(toAddContact) });
    const userId = await this._authService.authHttp(req);
    const _user = await this.findOne({ _id: userId.id });

  

    if (_user.contacts.indexOf(_toAddContact._id) === -1) {
        try {
          const result =  await this._model.findByIdAndUpdate(
            new ObjectId(_user.id),
            {
              $push: {
                contacts: {
                  contactId: _toAddContact.id,
                  status: StatusEnum.Pending
                }
              }
            },
            { new: true })
            .then(data => {
              return this._model.findByIdAndUpdate(
                new ObjectId(_toAddContact.id),
                {
                  $push: {
                    contacts: {
                      contactId: data.id,
                      status: StatusEnum.Invited
                    }
                  }
                },
                { new: true }
              ).exec();
            })
            .then(data => data.toJSON());

            this._gateway.io.to(_toAddContact.id).emit('invitation', {connectedTo:'Invitiation Received'});
            
            return result;

        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    } else throw new HttpException(`User added`, HttpStatus.BAD_REQUEST)

  }

  async getContacts(req: Express.Request) {
    console.log('test');
      try {
          const userId = await this._authService.authHttp(req);
          const user = await this.findById(userId.id);

          const userIdArr = [...user.contacts.map(contact => contact.contactId + '')];
          const contactsAuth = await this._authService.getUser(userIdArr);
          contactsAuth.data.forEach(contact => {
              user.contacts.map(notiContact => {
                  if (contact._id === notiContact.contactId + '') {
                    contact.status = notiContact.status;
                  }
              });
          });
          return contactsAuth.data;
      } catch (e) {
          throw new HttpException(`Not authorized`, HttpStatus.INTERNAL_SERVER_ERROR);
      }

  }

  async removeContact(AddContactVm: AddContactVm, req) {

      const { toAddContact } = AddContactVm;
      const user = await this._authService.authHttp(req);
      const _user = await this.findOne({ _id: user.id });
      const _toAddContact = await this.findOne({ username: toAddContact });
      if (_user.contacts.indexOf(_toAddContact._id) > -1) {
          const result = await this.deleteContacts({ _id: _user.id }, _toAddContact._id);
          return result.toJSON() as User;
      } else throw new HttpException(`Not existing contact`, HttpStatus.BAD_REQUEST)

  }

  async makeFriends(addContactVm: AddContactVm, req) {
    
      const { toAddContact } = addContactVm;
      let user = await this._authService.authHttp(req);
      const _user = await this.findOne({ _id: user.id });
      const _toAddContact = await this.findOne({ _id: toAddContact });
      const contact = _user.contacts.filter(contact => _toAddContact.id + '' === contact.contactId + '');
     
      if (contact[0].status === 'Invited') {
          const modUser = await this._model.findOneAndUpdate(
            {
              "_id":_user.id,  
              "contacts.contactId": _toAddContact.id
            },
            {
                "$set": { "contacts.$.status": StatusEnum.Friend }
            },
            { new: true }
          ).exec();

          const modContact = await this._model.findOneAndUpdate(
            {
              "_id":_toAddContact.id, 
              "contacts.contactId": _user.id
            },
            {
                "$set": { "contacts.$.status": StatusEnum.Friend }
            },
            { new: true }
          ).exec();
          this._gateway.io.to(modContact.id).emit('confirmation', {connectedTo:'Invitation Accepted'});
          
        return modUser;
      }
  }

  async getAll(req: Express.Request, searchInput: string) {
    let _user;
    try {
      const search = searchInput['search'].toString();
      const user = await this._authService.authHttp(req);
      _user = await this.findOne({ _id: user.id });

      //Create array of contacts
      const contArr = [];
      _user.contacts.forEach(contact => contArr.push(contact.contactId));
      
      const allUsers = await this._model.find(
        {'_id': { $nin: [...contArr, _user.id]}}
      );

      const usersIdArr = [];
      allUsers.forEach(user => usersIdArr.push(user.id+''));
      
      const contactsArr = [];
      const contactsAuth = await this._authService.getUser(usersIdArr);
      contactsArr.push(...contactsAuth.data);
      
      return contactsArr.filter(user => {
        const regex = new RegExp(search, 'gi')
        return regex.test(user.username);
      })

    } catch (e) {
      throw new HttpException(`Not authorized`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
