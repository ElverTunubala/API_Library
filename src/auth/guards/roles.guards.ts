import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthService } from '../jwt.service';  
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true; 
    }
    const request = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    const payload = await this.authService.verifyToken(token);
    const userRole = payload.rol; // devuelve user o admin

    if (!roles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    return true;
  }
}
