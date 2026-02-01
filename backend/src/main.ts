import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para permitir requests desde el frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,// elimina props no declaradas en el DTO
      forbidNonWhitelisted: true, // tira error si mandan de más
      transform: true,// transforma payload a la clase DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
