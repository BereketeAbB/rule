import { IsOptional, IsUUID } from "class-validator";

export class AndConditionType {
    @IsUUID()
    id: string;

    @IsUUID()
    conditionsId: string


    @IsUUID()
    @IsOptional()
    andConditionId?: string

}