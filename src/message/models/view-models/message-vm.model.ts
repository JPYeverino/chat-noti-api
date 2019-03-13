import { BaseModelVM } from "src/shared/base.model";
import { ApiModelProperty } from "@nestjs/swagger";
import { UserVm } from "src/user/models/view-models/user-vm.model";
import { ConversationVm } from "src/conversation/models/view-models/conversation-vm.model";

export class MessageVm extends BaseModelVM {
    @ApiModelProperty({required: true}) author: string;
    @ApiModelProperty({ required: true }) content: string;
    @ApiModelProperty() conversation?: string;
    @ApiModelProperty({ isArray: true }) seen?: string[];

}