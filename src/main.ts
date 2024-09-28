import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   //for validating and transforming input data based on Dto's
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  //Config Swagger to API Documentation
  const config = new DocumentBuilder()
    .setTitle('Libary API')
    .setDescription(
      'This is a library where you will find all kinds of books and their authors.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('library', app, document);
  
  await app.listen(3000);
}
bootstrap();
