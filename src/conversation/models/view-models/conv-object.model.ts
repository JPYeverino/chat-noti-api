import { ApiModelProperty } from "@nestjs/swagger";
import { UserVm } from "../../../user/models/view-models/user-vm.model";

export class ConvObject {
    @ApiModelProperty() conversationId: string;
    @ApiModelProperty({type: UserVm, isArray: true}) users: UserVm[];
}