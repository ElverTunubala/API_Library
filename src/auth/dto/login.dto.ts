import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty() //asegura que el valor del campo no sea null, undefined o una cadena vacía ('').
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
