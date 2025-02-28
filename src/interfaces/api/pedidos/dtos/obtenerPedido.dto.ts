import { IsNotEmpty, IsNumber } from 'class-validator';

export class ObtenerPedidosDto {
  @IsNotEmpty({ message: 'El ID del pedido es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id!: number;
}
