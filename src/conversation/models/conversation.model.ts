import { User } from "src/user/models/user.model"; 
import { BaseModel, schemaOptions } from "src/shared/base.model";
import { prop, arrayProp, Ref, ModelType } from "typegoose";
import { Message } from "src/message/models/message.model";
import { Mongoose, Types } from "mongoose";
import { UserVm } from "src/user/models/view-models/user-vm.model";

export class Conversation extends BaseModel<Conversation> {
    @arrayProp({items: UserVm}) participants: UserVm[] = [];

    static get model(): ModelType<Conversation> {
        return new Conversation().getModelForClass(Conversation, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}