import { Injectable } from '@nestjs/common';
import { CreateRuleDTO } from './dto/create-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Condition } from 'src/entity/conditions.entity';
import { Repository } from 'typeorm';
import { OrCondition } from 'src/entity/or-conditions.entity';
import { Action } from 'src/entity/action.entity';


const psedoRequest = {
    rule: {
        orCondition:
            [
                [
                    {
                        name: "age",
                        operator: ">",
                        value: "23"
                    },
                    {
                        name: "name",
                        operator: "=",
                        value: "ammanuel"
                    },
                    {
                        name: "name",
                        operator: "=",
                        value: "Sami"
                    }
                ],
                [
                    {
                        name: "name",
                        operator: "=",
                        value: "yonas"
                    }
                ]
            ],
        action: [
            {
                name: "notify",
                operator: "=",
                value: "ammanuel"
            },
            {
                name: "set",
                operator: "=",
                value: "A"
            },
            {
                name: "welcome",
                operator: "=",
                value: "Wellcomeee"
            }
        ]
    }
}

@Injectable()
export class RuleService {

    constructor(
        @InjectRepository(Condition) private readonly repositoryCondition: Repository<Condition>,
        @InjectRepository(OrCondition) private readonly repositoryOrCondition: Repository<OrCondition>,
        @InjectRepository(Action) private readonly repositoryAction: Repository<Action>,
    ) { }

    async createRule(createRuleDto: CreateRuleDTO) {
        return await this.decodeCreateRuleDto()
    }


    async getConditions() {
        return await this.repositoryCondition.find({
            where: { id: 'ff0b7f95-3145-4228-b4f4-816c61c69cf1' },
            relations: ['nextAndCondition', 'nextAndCondition.nextAndCondition']
        })
    }


    private async decodeCreateRuleDto() {
        const createRuleDto = psedoRequest

        const actions = createRuleDto.rule.action
        const treeActions = actions
        for (let i = actions.length; i > 0; i--) {
            if (i == actions.length) {
                treeActions[i - 1]['nextAction'] = undefined
                treeActions[i - 1] = this.repositoryAction.create(treeActions[i - 1])
            }
            else {
                treeActions[i - 1] = this.repositoryAction.create(treeActions[i - 1])
                treeActions[i - 1]['nextAction'] = treeActions[i]
            }
        }

        const savedActions = await this.repositoryAction.save(treeActions[0])
        const parentActionId = savedActions.id

        const orConditions = createRuleDto.rule.orCondition
        // const savedAndCondition: AndCondition[] = []
        const parentAndConditions = []

        // const x = await Promise.all([
        for (const ands of orConditions) {
            const treeAndConditions = ands;

            for (let i = ands.length; i > 0; i--) {
                if (i === ands.length) {
                    treeAndConditions[i - 1] = this.repositoryCondition.create(treeAndConditions[i - 1]);
                } else {
                    treeAndConditions[i - 1] = this.repositoryCondition.create(treeAndConditions[i - 1]);
                    treeAndConditions[i - 1]['nextAndCondition'] = treeAndConditions[i];
                }
            }

            const savedConditions = await this.repositoryCondition.save(treeAndConditions[0]);

            console.log(savedConditions);

            parentAndConditions.push(savedConditions.id);
        }

        const orConditionObj = this.createNestedOrStructure(parentAndConditions, parentActionId)

        const createdOrConditions = this.repositoryOrCondition.create(orConditionObj)
        const savedOrConditions = await this.repositoryOrCondition.save(createdOrConditions)
        return savedOrConditions
    }


    createNestedOrStructure(uuids: string[], parentActionId): OrCondition | undefined {
        if (uuids.length === 0) {
            return undefined;
        }
        const [firstUuid, ...restUuids] = uuids;

        const nestedStructure: OrCondition = {
            parentAndConditionId: firstUuid,
            actionId: parentActionId,
            nextParentAndCondition: this.createNestedOrStructure(restUuids, parentActionId),
        };


        return nestedStructure;
    }
}
