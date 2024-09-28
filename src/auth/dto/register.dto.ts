import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LoginAuthDto } from './login.dto';
import { Role } from 'src/roles/roles.enum';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}
