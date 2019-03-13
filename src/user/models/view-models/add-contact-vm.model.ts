import { ApiModelProperty } from "@nestjs/swagger";

export class AddContactVm {
    @ApiModelProperty() toAddContact: string;
}