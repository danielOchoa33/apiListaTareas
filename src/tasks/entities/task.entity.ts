import { UserTask } from 'src/usersTasks/entities/userTask.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';

@Entity({name:'tasks'})
export class Tasks {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre : string;

    @Column({nullable:false})
    descripcion:string;
    
    @Column({nullable:false})
    prioridad:string;

    @Column({default: 'PENDIENTE'})
    estatus:string;

    @Column({name:'userId'})
    userId:number

    @ManyToOne(() => UserTask, userTask => userTask.tasks)
    @JoinColumn({ name: 'userId' })
  task?: UserTask

 
}