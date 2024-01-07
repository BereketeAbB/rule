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
                        operator: "=",
                        value: "23"
                    },
                    {
                        name: "name",
                        operator: "=",
                        value: "sami"
                    }
                ],
                [
                    {
                        name: "gender",
                        operator: "=",
                        value: "male"
                    }
                ]
            ],
        action: [
            {
                name: "notify",
                operator: "=",
                value: "Please Call Me As Soon As Poosible"
            },
            {
                name: "set",
                operator: "=",
                value: "C"
            }
        ]
    }
}

const psedoUser = {
    name: "sami",
    age: 23,
    gender: 'male'
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

    async generateFilterFromUser() {

        for (const key in psedoUser) {
            const orConds: Condition[][] = await this.getConditions(key, psedoUser[key])
            this.filterUser(orConds)
        }
    }

    async filterUser(orCondition: Condition[][]) {
        let takeAction = false
        for (const andCondition of orCondition) {
            for (const check of andCondition) {
                if (psedoUser[check['name']] && psedoUser[check['name']] == check['value']) {
                    takeAction = true
                } else {
                    takeAction = false
                    break
                }
            }
            if (takeAction) break
        }

        if (takeAction) {
            const action = await this.repositoryAction.findOne({ where: { id: orCondition[0][0].parentActionId } })
            const actionGroup = await this.repositoryAction.find({ where: { group: action.group } })

            this.takeAction(psedoUser, actionGroup)
        } else {
            Logger.warn("User doesnt match any conditions")
        }
    }

    private async takeAction(user: any, actions: Action[]) {
        for (const action of actions) {
            if (action.name == 'notify') {
                this.notify(action.value)
            } else if (action.name == 'set') {
                psedoUser['class'] = action.value
                console.log({ psedoUser })
            }
        }
    }

    async getConditions(name: string, value: any) {
        const allConditions = await this.repositoryCondition.find({})

        const filteredCondition = allConditions.filter((cond) => cond.name == name && cond.value == value)
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
                treeActions[i - 1]['nextAction'] = treeActions[i]
                treeActions[i - 1] = this.repositoryAction.create(treeActions[i - 1])
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
                if (i == 1) {
                    treeAndConditions[i - 1]['parentActionId'] = parentActionId
                    treeAndConditions[i - 1]['actionGroup'] = actionGroup
                    treeAndConditions[i - 1]['nextAndCondition'] = treeAndConditions[i];
                    treeAndConditions[i - 1] = this.repositoryCondition.create(treeAndConditions[i - 1]);
                }
                else {
                    treeAndConditions[i - 1]['nextAndCondition'] = treeAndConditions[i];
                    treeAndConditions[i - 1] = this.repositoryCondition.create(treeAndConditions[i - 1]);
                }
            }

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
        Logger.warn("Notification: " + text)
    }
}
