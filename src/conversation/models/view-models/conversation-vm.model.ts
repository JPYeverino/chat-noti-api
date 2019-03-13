import { BaseModelVM } from "src/shared/base.model";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { Conversation } from "src/conversation/models/conversation.model";
import { UserVm } from "src/user/models/view-models/user-vm.model";
import { MessageVm } from "src/message/models/view-models/message-vm.model";

export class ConversationVm extends BaseModelVM {
    @ApiModelProperty({type: UserVm, isArray: true, required: true}) participants: UserVm[];
}