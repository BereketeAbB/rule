import { Entity, Column, Tree, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TreeChildren, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Condition } from './conditions.entity';

@Entity({ name: 'actions' })
// @Tree('adjacency-list')
export class Action {
    @PrimaryGeneratedColumn('uuid')
    // @Column()
    id?: string;

    @Column()
    name: string;

    @Column({ default: '=' })
    operator: string;

    @Column()
    value: string

    @Column({ nullable: true, type: 'uuid' })
    nextActionId: string

    // @TreeChildren()
    @OneToOne(() => Action, action => action.parentAction, { cascade: ['insert'] })
    @JoinColumn()
    nextAction: Action

    @OneToOne(() => Action, action => action.nextAction, { cascade: ['insert'] })
    parentAction: Action

    @OneToMany(() => Condition, condition => condition.parentAction)
    parentAndCondition: Condition

    @Column()
    group: string

    @ManyToOne(() => Condition, condition => condition.actGrp)
    @JoinColumn()
    grp: Condition[]
}
