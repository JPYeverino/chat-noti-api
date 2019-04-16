import { BaseModel, schemaOptions } from "../../shared/base.model";
import { prop, arrayProp, Ref, ModelType } from "typegoose";
import { UserVm } from "../../user/models/view-models/user-vm.model";

export class Conversation extends BaseModel<Conversation> {
    @arrayProp({items: UserVm}) participants: UserVm[] = [];

    static get model(): ModelType<Conversation> {
        return new Conversation().getModelForClass(Conversation, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}