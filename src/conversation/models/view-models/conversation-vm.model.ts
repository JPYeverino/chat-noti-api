import { BaseModelVM } from "../../../shared/base.model";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { UserVm } from "../../../user/models/view-models/user-vm.model";

export class ConversationVm extends BaseModelVM {
    @ApiModelProperty({type: UserVm, isArray: true, required: true}) participants: UserVm[];
}