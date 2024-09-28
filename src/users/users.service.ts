import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/roles.enum'; // Importa el enum

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Validar que el rol está en el enum
      if (!Object.values(Role).includes(createUserDto.role)) {
        throw new NotFoundException('Role not found');
      }

      // Crear y guardar el nuevo usuario
      const newUser = this.userRepository.create({ ...createUserDto });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll() {
    try {
      // Devuelve todos los usuarios
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.preload({ id, ...updateUserDto });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Validar el rol si se está actualizando
      if (updateUserDto.role && !Object.values(Role).includes(updateUserDto.role)) {
        throw new NotFoundException('Role not found');
      }

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }
}
