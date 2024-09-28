import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './shemas/book.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGODB_URI), // Conexión a MongoDB desde el .env
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]), // Registro del esquema
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
