import { IsOptional, IsUUID } from "class-validator";

export interface NestedOrCondition {
    parentCondition: string;
    nextParent?: NestedOrCondition;
}

export class OrConditionType {
    @IsUUID()
    parentCondition: string;

    @IsUUID()
    @IsOptional()
    nextParent?: OrConditionType

}

export type NestedCondition = {
    parentCondition: string;
    nextParent?: NestedCondition[];
};