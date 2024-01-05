import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRuleDTO } from './dto/create-rule.dto';
import { RuleService } from './rule.service';

@Controller('rule')
export class RuleController {
    constructor(private readonly ruleService: RuleService) { }

    @Post('')
    async createRule(@Body() createRuleDto: CreateRuleDTO) {
        return await this.ruleService.createRule(createRuleDto)
    }

    @Get('')
    async getConditions() {
        return await this.ruleService.getConditions()
    }

}
