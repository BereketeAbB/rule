// import { IsOptional, IsString, ValidateNested } from "class-validator";

// class AndCondition {
//     @IsString()
//     name: string;

//     @IsString()
//     operator: string;

//     @IsString()
//     value: string;
// }

// class OrCondition {
//     @ValidateNested({ each: true })
//     andCondition: AndCondition[]
// }

// class Action {
//     @IsString()
//     name: string;

//     @IsOptional()
//     operator?: string;

//     value: string;
// }
// export type Rule = [OrCondition[], Action[]]

// export type CreateRuleDTO = Rule[]

import { IsOptional, IsString, IsUUID } from "class-validator";
// import { Action } from "src/entity/action.entity";

class AndCondition {
    @IsString()
    name: string;

    @IsString()
    operator: string;

    @IsString()
    value: string;

    @IsUUID()
    nexnextAndConditionId?: string

    @IsOptional()
    nextAndCondition?: AndCondition
}


class OrCondition {
    andCondition: AndCondition[]
}

class Action {
    @IsString()
    name: string;

    @IsOptional()
    operator: string;

    value: string;
    nextActionId: string
    nextAction: Action
}
class Rule {
    orCondition: OrCondition[];
    action: Action[];
} []

export class CreateRuleDTO {
    rule: Rule
}