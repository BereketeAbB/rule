// import { Entity, Column, Tree, OneToOne, ManyToOne } from 'typeorm';
// import { Condition } from './conditions.entity';
// import { UUID } from 'crypto';
// import { OrCondition } from './or-conditions.entity';

// @Entity({ name: 'and_conditions' })
// @Tree("nested-set")
// export class AndCondition {
//     @Column({ type: 'uuid' })
//     id: string;

//     @Column({ type: 'uuid' })
//     conditionsId: string

//     @ManyToOne(() => Condition, (condition) => condition.id)
//     conditions: Condition

//     @Column({ nullable: true })
//     andConditionId: string

//     @OneToOne(() => AndCondition, (andCondition) => andCondition.id, { eager: true })
//     andCondition: AndCondition

//     @OneToOne(() => OrCondition, (orCondition) => orCondition.andConditionId, { nullable: true })
//     orConditionRoot: OrCondition
// }