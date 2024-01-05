import { Module } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from 'src/entity/action.entity';
// import { AndCondition } from 'src/entity/and-conditions.entity';
import { OrCondition } from 'src/entity/or-conditions.entity';
import { Condition } from 'src/entity/conditions.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, OrCondition, Condition, User])
  ],
  controllers: [RuleController],
  providers: [RuleService]
})
export class RuleModule { }
