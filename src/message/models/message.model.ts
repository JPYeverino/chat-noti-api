import { BaseModel, schemaOptions } from "src/shared/base.model";
import { prop, Ref, ModelType, arrayProp } from "typegoose";
import { Conversation } from "src/conversation/models/conversation.model";
import { User } from "src/user/models/user.model";
import { UserVm } from "src/user/models/view-models/user-vm.model";
import { ConversationVm } from "src/conversation/models/view-models/conversation-vm.model";

export class Message extends BaseModel<Message> {
    @prop({required: true}) content: string;
    @prop({ ref: {name: 'Conversation' } }) conversation: Ref<Conversation>;
    @prop() author: string;
    @arrayProp({items: String}) seen: string[];

    static get model(): ModelType<Message> {
        return new Message().getModelForClass(Message, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}