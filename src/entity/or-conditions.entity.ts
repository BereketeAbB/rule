import { Entity, Column, Tree, OneToOne, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
// import { AndCondition } from './and-conditions.entity';
import { Action } from './action.entity';
import { Condition } from './conditions.entity';

@Entity({ name: 'or_conditions' })
// @Tree("nested-set")
export class OrCondition {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    parentAndConditionId: string

    // @OneToOne(() => Condition, (condition) => condition.id, { nullable: true })
    // parentAndCondition: Condition

    @Column({ nullable: true })
    nextParentAndConditionId?: string

    @OneToOne(() => OrCondition, (orCondition) => orCondition.currentParentAndCondition, { eager: true, cascade: ['insert'] })
    @JoinColumn()
    nextParentAndCondition?: OrCondition

    @OneToOne(() => OrCondition, (orCondition) => orCondition.nextParentAndCondition)
    currentParentAndCondition?: OrCondition

    @Column({ nullable: true })
    actionId: string

    // @OneToOne(() => Action, (action) => action.id, { nullable: true })
    // action: Action
}
// import { Entity, Column, Tree, OneToOne } from 'typeorm';
// import { AndCondition } from './and-conditions.entity';
// import { Action } from './action.entity';

// @Entity({ name: 'or_conditions' })
// @Tree("nested-set")
// export class OrCondition {
//     @Column({ type: 'uuid' })
//     id: string;

//     @Column()
//     andConditionId: string

//     @OneToOne(() => AndCondition, (andConditon) => andConditon.id, { nullable: true })
//     andCondition: AndCondition

//     @Column({ nullable: true })
//     orConditionId: string

//     @OneToOne(() => OrCondition, (orCondition) => orCondition.id, { eager: true })
//     orCondition: OrCondition

//     @Column({ nullable: true })
//     actionId: string

//     @OneToOne(() => Action, (action) => action.id, { nullable: true })
//     action: Action
// }