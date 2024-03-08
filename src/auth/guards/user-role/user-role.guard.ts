import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { UserTask } from 'src/usersTasks/entities/userTask.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector : Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    const req = context.switchToHttp().getRequest();
    const user = req.user as UserTask;

    if(!user)
    throw new BadRequestException('Usuario no encontrado.');

    if(validRoles.includes(user.role)){
      return true;
    }
    throw new ForbiddenException(
      `El Usuario ${user.nombre} no puede realizar esta peticion por falta de permisos.`
    )


  }
}
