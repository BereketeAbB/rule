import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRuleDTO } from './dto/create-rule.dto';
import { RuleService } from './rule.service';

@Controller('rule')
export class RuleController {
    constructor(private readonly ruleService: RuleService) { }

    @Post('')
    async createRule(@Body() createRuleDto: CreateRuleDTO) {
        return await this.ruleService.createRule(createRuleDto)
    }

    @Get('/:name/:value')
    async getConditions(@Param('name') name: string, @Param('value') value: any,) {
        return await this.ruleService.getConditions(name, value)
    }
    @Post('filter')
    async filterConditions(@Body() orCondition: any) {
        return await this.ruleService.filterUser(orCondition.orConditions)
    }

    @Post('filter-all')
    async filterAll() {
        return await this.ruleService.generateFilterFromUser()
    }

}
