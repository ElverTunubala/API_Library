import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../jwt.service'; 
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {//Si el método canActivate retorna true, la ruta es accesible; si retorna false, se deniega el acceso.
  constructor(private authService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.authService.extractTokenFromHeader(request);//obtener el token JWT del encabezado de autorización de la solicitud
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.authService.verifyToken(token);
    request['user'] = payload;
    return true;
  }
}
