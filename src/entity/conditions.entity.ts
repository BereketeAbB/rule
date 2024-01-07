import { Entity, Column, PrimaryGeneratedColumn, OneToMany, TreeRepository, Tree, TreeChildren, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { Action } from './action.entity';
// import { AndCondition } from './and-conditions.entity';

@Entity({ name: 'conditions' })
// @Tree('adjacency-list')
export class Condition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    operator: string;

    @Column()
    value: string

    @Column({ nullable: true })
    nextAndConditionId: string

    @OneToOne(() => Condition, (condition) => condition.currentAndCondition, { cascade: ['insert'], nullable: true })
    // @TreeChildren()
    @JoinColumn()
    nextAndCondition: Condition

    @OneToOne(() => Condition, { nullable: true })
    // @TreeChildren()
    currentAndCondition: Condition

    @Column({ nullable: true })
    parentActionId: string

    @ManyToOne(() => Action, action => action.parentAndCondition)
    @JoinColumn()
    parentAction: Action

    @Column({ nullable: true })
    actionGroup: string


    // @OneToMany(() => Action, action => action.grp)
    // actGrp: Action[]

    // @ManyToOne(() => Action, action => action.parentAndCondition)
    // @JoinColumn()
    // parentAction: Action
}



// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { AndCondition } from './and-conditions.entity';

// @Entity({ name: 'conditions' })
// export class Condition {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column()
//     name: string;

//     @Column()
//     operator: string;

//     @Column()
//     value: string

//     @OneToMany(() => AndCondition, (andCondition) => andCondition.conditionsId, { nullable: true })
//     nextAndCondition: AndCondition
// }
