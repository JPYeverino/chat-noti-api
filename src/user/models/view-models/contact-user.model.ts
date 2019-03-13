import { ApiModelProperty } from "@nestjs/swagger";
import { StatusEnum } from "../status-enum.enum";
import { Types } from "mongoose";
import { prop } from "typegoose";

export class ContactUser {
    @prop({required: true}) contactId: Types.ObjectId;
    @prop() status: StatusEnum;
}