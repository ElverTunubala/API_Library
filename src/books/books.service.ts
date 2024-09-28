import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './shemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const createdBook = new this.bookModel(createBookDto);
      return await createdBook.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating book');
    }
  }

  async findAll() {
    try {
      return await this.bookModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching books');
    }
  }

  async findOne(id: string): Promise<Book> {
    try {
      const book = await this.bookModel.findById(id).exec();
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return book;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching book');
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      const updatedBook = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
      if (!updatedBook) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return updatedBook;
    } catch (error) {
      throw new InternalServerErrorException('Error updating book');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.bookModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting book');
    }
  }
}
