import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './pedidos.entity';
import { PedidoItem } from './pedido-item.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoItem])], 
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}