import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SalonsModule } from './salons/salons.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { BebidaModule } from './bebida/bebida.module';
import { MenusModule } from './menus/menus.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
     type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
    rejectUnauthorized: false, 
  },

    }),
    UsersModule,
    SalonsModule,
    EventsModule,
    AuthModule,
    BebidaModule,
    MenusModule,
    ProveedoresModule,
    PedidosModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
