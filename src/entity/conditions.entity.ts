import { Entity, Column, PrimaryGeneratedColumn, OneToMany, TreeRepository, Tree, TreeChildren, JoinColumn, OneToOne, ManyToOne, TreeParent } from 'typeorm';
// import { AndCondition } from './and-conditions.entity';

@Entity({ name: 'conditions' })
@Tree('closure-table')
export class Condition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    operator: string;

    @Column()
    value: string

    // @Column({ nullable: true })
    // nextAndConditionId: string

    @OneToMany(() => Condition, (condition) => condition.currentAndCondition, { cascade: ['insert'], nullable: true })
    @TreeChildren()
    nextAndCondition: Condition[]

    @TreeParent()
    @OneToMany(() => Condition, (condition) => condition.nextAndCondition, { nullable: true, cascade: ['insert'] })
    @JoinColumn()
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
