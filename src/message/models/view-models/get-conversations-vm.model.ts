import { ApiModelProperty } from "@nestjs/swagger";

export class GetConversationsVm {
    @ApiModelProperty({required: true}) conversation: string;
}