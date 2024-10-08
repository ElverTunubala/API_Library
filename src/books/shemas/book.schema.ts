import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true, type: Date })
  publication_date: Date;

  @Prop()
  gender: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
