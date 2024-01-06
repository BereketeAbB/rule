import { Entity, Column, Tree, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, JoinColumn, TreeChildren, OneToMany, TreeParent } from 'typeorm';

@Entity({ name: 'actions' })
@Tree('closure-table')
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

    // @Column({ nullable: true, type: 'uuid' })
    // nextActionId: string


    @OneToOne(() => Action, action => action.currentParentAction, { cascade: ['insert'], nullable: true, eager: true })
    @TreeChildren()
    nextAction: Action

    @OneToOne(() => Action, action => action.nextAction, { nullable: true, cascade: ['insert'] })
    @JoinColumn()
    @TreeParent()
    currentParentAction: Action
}
//     @OneToMany(() => Action, action => action.currentParentAction, { cascade: ['insert'], nullable: true, eager: true })
//     @TreeChildren()
//     nextAction: Action[]

//     @OneToOne(() => Action, action => action.nextAction, { nullable: true, cascade: ['insert'] })
//     @JoinColumn()
//     @TreeParent()
//     currentParentAction: Action
// }