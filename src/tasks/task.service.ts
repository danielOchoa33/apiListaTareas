import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
import { handleDBExceptions } from "src/Utils/handleDBExceptions.utils";
import { InjectRepository } from "@nestjs/typeorm";

import { Tasks } from "./entities/task.entity";
import { TaskDto } from "./dto/TaskDto";
import { UserTask } from "src/usersTasks/entities/userTask.entity";
import { ValidStatus } from "./interfaces/estatus.interface";
import { SearchTaskDto } from "./dto/SearchTaskDto";




@Injectable()
export class TaskService{
    constructor(
        @InjectRepository(Tasks)
        private taskRepository: Repository<Tasks>, 
        @InjectRepository(UserTask)
        private userTaskRepository: Repository<UserTask>,    
    ){}

    async addTask(taskDto:TaskDto){
        const {nombre, descripcion, prioridad,userId} = taskDto;
        try {

            const userTaskBD = await this.userTaskRepository.findOne({where:{id:userId}});

            if(!userTaskBD){
                throw new Error('No se encontro un usuario con ese id');
            }

            const task =  this.taskRepository.create({
                nombre,
                descripcion,
                prioridad,
                task:{
                    id:userTaskBD.id,
                    nombre: userTaskBD.nombre
                }
            });

            const saveTask = await this.taskRepository.save(task);

            return saveTask;

            
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                handleDBExceptions(error,'TaskService');
              }           
        }
        
    }

    async getAllTasks(userId:number):Promise<Tasks[]>{
        try {
            return this.taskRepository.find({
                where: {
                  estatus: Not(ValidStatus.ELIMINADA),
                  userId
                },
              });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                handleDBExceptions(error,'TaskService');
              } 
        }
    }

    async searchTask(userId: number,task: SearchTaskDto): Promise<any>{
        const {nombre,prioridad,estatus} = task;
        try {
            const condiciones:{[key:string]:any} ={userId: userId};

            if (nombre !== undefined && nombre !== null && nombre !=='') {
                condiciones.nombre = nombre;
              }
        
              if (prioridad!== undefined && prioridad !== null && prioridad !=='' ) {
                condiciones.prioridad = prioridad;
              }
        
              if (estatus !== undefined && estatus !== null && estatus !== '' && estatus !== 'ELIMINADA') {
                condiciones.estatus = estatus;
              }

              let tasks :any[]

                tasks = await this.taskRepository.find({ where: { ...condiciones, estatus: Not(ValidStatus.ELIMINADA) } });
        
        
            
            return tasks;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                handleDBExceptions(error,'TaskService');
              } 
        }
    }

    async upDateTask( estatus:string, taskId :number){
        try {

            const taskBD = await this.taskRepository.findOne({where:{id:taskId}});

            if(!taskBD) throw new NotFoundException('No se encontro una tarea con el id.');
            
            taskBD.estatus = ValidStatus[estatus];

            const saveTask = await this.taskRepository.save(taskBD);

            return saveTask;

            
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                handleDBExceptions(error,'TaskService');
              }           
        }
        
    }

}