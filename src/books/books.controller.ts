import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@ApiTags('books')
@Controller('books')
@UseGuards(AuthGuard, RolesGuard)//verifica si hay token en todo el crud
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Roles('admin')
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(
    @Query('author') author?: string,
    @Query('gender') gender?: string,
    @Query('publication_date') publicationDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    // Convierte la fecha si se proporciona
    const date = publicationDate ? new Date(publicationDate) : undefined;
    return this.booksService.findAll(author, gender, date, page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }
  
  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
