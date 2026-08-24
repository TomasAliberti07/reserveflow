import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;
  
  // Limpiamos cualquier barra final que pueda venir en las variables de entorno
  const cleanFrontendUrl = frontendUrl?.replace(/\/$/, '');

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    ...(cleanFrontendUrl ? [cleanFrontendUrl] : []),
  ];

  app.enableCors({
    origin: (origin, callback) => {

      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por política de CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();