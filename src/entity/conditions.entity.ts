import { Entity, Column, PrimaryGeneratedColumn, OneToMany, TreeRepository, Tree, TreeChildren, JoinColumn, OneToOne } from 'typeorm';
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
