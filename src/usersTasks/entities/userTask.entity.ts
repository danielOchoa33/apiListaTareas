import { Tasks } from 'src/tasks/entities/task.entity';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn} from 'typeorm';

@Entity({name:'users'})
export class UserTask {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre : string;
    
    @Column({nullable:false, unique:true})
    correo:string;

    
    @Column({default:'', nullable:false})
    password:string;

    @Column({default: 'ADMINISTRADOR'})
    role:string;

    @Column({default: 'ACTIVO'})
    estatus:string;

    @OneToMany(type => Tasks, task => task.id)
    tasks: Tasks[];
}