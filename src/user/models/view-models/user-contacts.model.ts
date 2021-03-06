import { ApiModelProperty } from "@nestjs/swagger";
import { StatusEnum } from "../status-enum.enum";
import { BaseModelVM } from "../../../shared/base.model";

export class userContact extends BaseModelVM {
    @ApiModelProperty() contactId: string;
    @ApiModelProperty() status: StatusEnum;
}