import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt.payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserTask } from "src/usersTasks/entities/userTask.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(UserTask)
        private readonly userTaskRepository: Repository<UserTask>,
         configService: ConfigService
    ){
        super({            
            secretOrKey:configService.get('SECRET_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload):Promise<UserTask>{
        const { id } = payload;
        try {
            const user = await this.userTaskRepository.findOne({where:{id}})

        if(!user)
        throw new UnauthorizedException('Token no valido.')

        if((user).estatus !== "ACTIVO"){
            throw new UnauthorizedException('Usuario inactivo, llame al administrador.')
        }

        return user;
        } catch (error) {
            
        }
        
    }
}