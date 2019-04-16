import { Conversation } from "conversation/models/conversation.model";
import { BaseModel, schemaOptions } from "../../shared/base.model";
import { prop, ModelType, arrayProp, Ref } from "typegoose";
import { ContactUser } from "./view-models/contact-user.model";

export class User extends BaseModel<User> {
    @arrayProp({items: ContactUser, _id: false}) contacts?: ContactUser[];
    // @arrayProp({itemsRef: {name: Conversation}}) conversations?: Ref<Conversation>[];
    
    static get model(): ModelType<User> {
        return new User().getModelForClass(User, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}