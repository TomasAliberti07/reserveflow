import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SalonsModule } from './salons/salons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "TRIMLY2025",
      database: "reserveflow",
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    SalonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
