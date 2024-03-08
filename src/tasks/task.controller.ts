import {Controller,Body,Post, BadRequestException, Param, Put, Get} from '@nestjs/common';
import { TaskDto } from './dto/TaskDto';
import { TaskService } from './task.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { SearchTaskDto } from './dto/SearchTaskDto';



@Controller('tasks')
export class TaskController{
    constructor(private taskService:TaskService){}

    @Post("add/task")
    @Auth(ValidRoles.administrador)
    async addTask(@Body() task: TaskDto){
        try {
            if(task){
                return this.taskService.addTask(task);
            } 
        } catch (error) {
            throw new BadRequestException('Ocurrio un error al guardar al tarea.')   
        }
    }

    @Put("update/task/:taskId/:estatus")
    @Auth(ValidRoles.administrador)
    async deleteTask(@Param('taskId') taskId:number, @Param('estatus') estatus:string){
        try {
            if(!!taskId && !!estatus){
                return this.taskService.upDateTask(estatus,taskId);
            } 
        } catch (error) {
            throw new BadRequestException('Ocurrio un error al eliminar al tarea.')   
        }
    }

@Get("getTask/:userId")
@Auth(ValidRoles.administrador)
async getAllUsers(@Param('userId') userId:number){
    try {
        return this.taskService.getAllTasks(userId);
    } catch (error) {
        throw new BadRequestException('Ocurrio un error al obtner el listado de tareas.')   
    }
}

@Post('search/task/:userId')
async buscarPieza(@Body() task: SearchTaskDto, @Param('userId')userId:number){
    try {
        return this.taskService.searchTask(userId,task);
    } catch (error) {
        throw new Error('ocurrio un error al buscar la pieza')
    }
}
}
