import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register.dto';
import { hash, compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { Role } from 'src/roles/roles.enum'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(userObject: RegisterAuthDto) {
    const user = new UserEntity();

    const { password, role } = userObject;
    const plainToHash = await hash(password, 10); // Retorna la contraseña encriptada
    userObject = { ...userObject, password: plainToHash };

    const findEmail = await this.userRepository.findOne({ where: { email: userObject.email } });
    if (findEmail) throw new HttpException('USER ALREADY EXISTS', 404);

    // Aquí puedes verificar el rol directamente sin necesidad de buscarlo en la base de datos
    if (!Object.values(Role).includes(role)) {
      throw new HttpException('Invalid role', 400);
    }

    user.email = userObject.email;
    user.password = userObject.password;
    user.role = role; // Asigna el rol directamente desde el DTO

    await this.userRepository.save(user);

    return { user }; // Devuelve el usuario creado (puedes ajustar según sea necesario)
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.userRepository.findOne({ where: { email } });

    if (!findUser) throw new HttpException('USER NOT FOUND', 404);

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) throw new HttpException('PASSWORD INCORRECT', 403);

    const payload = { id: findUser.id, email: findUser.email, role: findUser.role }; // Usa el rol directamente
    const token = this.jwtService.sign(payload);
    const data = {
      token,
      role: findUser.role,
      userId: findUser.id,
    };
    return data;
  }
}
