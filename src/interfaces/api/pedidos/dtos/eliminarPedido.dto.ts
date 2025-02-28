import { IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarPedidoDto {
  @IsNotEmpty({ message: 'El ID del pedido es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_pedido!: number;
}
