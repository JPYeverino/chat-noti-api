import { BaseModelVM } from "../../../shared/base.model";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { ConversationVm } from "conversation/models/view-models/conversation-vm.model";
import { userContact } from "./user-contacts.model";

export class UserVm extends BaseModelVM {
    @ApiModelProperty() username?: string;
    @ApiModelProperty() status?: string;
    @ApiModelProperty() avatarUrl?: string;
    @ApiModelProperty() conversation?: string;
    @ApiModelProperty({isArray: true}) contacts?: userContact;
}