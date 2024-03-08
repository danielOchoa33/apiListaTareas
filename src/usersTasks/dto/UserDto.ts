import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UserDto {
    @IsNotEmpty({message:'El nombre es requerido.'})
    nombre:string;
    @IsNotEmpty({message:'El Correo  es requerido.'})
    @IsEmail({},{message:'El campo no es un correo valido.'})
    correo:string;
    @IsNotEmpty({message:'La contraseña  es requerida.'})
    password?:string;
    role:string;
    token:string
}