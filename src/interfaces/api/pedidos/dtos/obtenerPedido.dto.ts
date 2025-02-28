import { IsOptional, IsNumber } from 'class-validator';

export class ObtenerPedidosDto {
  @IsOptional({ message: 'El ID del pedido es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_pedido!: number;
}
