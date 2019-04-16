import { BaseModelVM } from "../../../shared/base.model";
import { ApiModelProperty } from "@nestjs/swagger";
import { UserVm } from "../../../user/models/view-models/user-vm.model";
import { ConversationVm } from "conversation/models/view-models/conversation-vm.model";

export class MessageVm extends BaseModelVM {
    @ApiModelProperty({ required: true }) author: string;
    @ApiModelProperty({ required: true }) content: string;
    @ApiModelProperty({ required: true }) conversation?: string;
    @ApiModelProperty({ isArray: true }) seen?: string;

}