import { BaseModelVM } from "src/shared/base.model";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { ConversationVm } from "src/conversation/models/view-models/conversation-vm.model";

export class UserVm extends BaseModelVM {
    @ApiModelProperty() username?: string;
    @ApiModelProperty() status?: string;
    @ApiModelProperty() avatarUrl?: string;
    @ApiModelProperty() conversation?: string;
}