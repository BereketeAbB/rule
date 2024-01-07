import { Injectable, Logger } from '@nestjs/common';
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
                        value: "yonass"
                    },
                    {
                        name: "firstname",
                        operator: "=",
                        value: "SamiGo"
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

const psedoUser = {
    name: "Sami",
    age: 45
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

    async filterUser(orCondition: Condition[][]) {
        for (const andCondition of orCondition) {
            const action = await this.repositoryAction.findOne({ where: { id: andCondition[0].parentActionId } })
            console.log(action)
        }
    }

    async getConditions() {
        const allConditions = await this.repositoryCondition.find({})

        const filteredCondition = allConditions.filter((cond) => cond.name == 'age' && cond.value == '23')
        const orConditions: Condition[][] = []
        for (const checkCondition of filteredCondition) {
            const family: Condition[] = this.getParentNdChild(checkCondition, allConditions)
            console.log(family)
            orConditions.push([...family])

        }
        return orConditions;
    }

    private getParentNdChild(condition: Condition, conditionsArray: Condition[]): Condition[] {
        const p = this.getParents(condition, conditionsArray, [])
        p.push(condition)
        const c = this.getChildren(condition, conditionsArray, p)
        return c
    }

    private getParents(condition: Condition, conditionsArray: Condition[], line: Condition[]): Condition[] {
        const parent = conditionsArray.find((cond) => cond.nextAndConditionId == condition.id)
        if (!parent) return [];
        this.getParents(parent, conditionsArray, line)
        line.push(parent)
        return line
    }

    private getChildren(condition: Condition, conditionsArray: Condition[], line: Condition[]): Condition[] {
        const child = conditionsArray.find((cond) => cond.id == condition.nextAndConditionId)
        if (!child) return line;
        this.getChildren(child, conditionsArray, line)
        line.push(child)
        return line
    }

    private async decodeCreateRuleDto() {
        const createRuleDto = psedoRequest

        const actions = createRuleDto.rule.action
        const treeActions = actions
        const actionGroup = Math.floor(Math.random() * 10000) + 1;
        for (let i = actions.length; i > 0; i--) {
            if (i == actions.length) {
                treeActions[i - 1]['nextAction'] = undefined
                treeActions[i - 1]['group'] = actionGroup
                treeActions[i - 1] = this.repositoryAction.create(treeActions[i - 1])
            }
            else {
                treeActions[i - 1]['group'] = actionGroup
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

            treeAndConditions[0]['parentActionId'] = parentActionId
            treeAndConditions[0]['actionGroup'] = actionGroup
            const savedConditions = await this.repositoryCondition.save(treeAndConditions[0]);

            parentAndConditions.push(savedConditions.id);
        }

        const orConditionObj = this.createNestedOrStructure(parentAndConditions, parentActionId)

        const createdOrConditions = this.repositoryOrCondition.create(orConditionObj)
        const savedOrConditions = await this.repositoryOrCondition.save(createdOrConditions)
        return savedOrConditions
    }

    private createNestedOrStructure(uuids: string[], parentActionId): OrCondition | undefined {
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

    private notify(text: string) {
        Logger.log("Notification: " + text)
    }
}
