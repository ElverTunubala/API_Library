import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)//verifica si hay token en todo el crud
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('admin', 'user')  // Permite a admin y user
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Roles('admin', 'user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}