import { Entity, Column, Tree, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, TreeChildren, JoinColumn } from 'typeorm';

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
    @OneToOne(() => Action, action => action.currentAction, { cascade: ['insert'] })
    @JoinColumn()
    nextAction: Action

    @OneToOne(() => Action, action => action.nextAction, { eager: true, cascade: ['insert'] })
    currentAction: Action
}