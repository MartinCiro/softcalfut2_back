import { IsOptional, IsNumber, IsString, IsDate, isEmail } from 'class-validator';

export class ActualizarPedidoDto {
  @IsOptional()
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_pedido?: number;

  @IsOptional()
  @IsString({ message: 'Debe ser un texto válido' })
  readonly descripcion?: string;

  @IsOptional()
  @IsDate({ message: 'Debe ser una fecha válida' })
  readonly fecha?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_usuario?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_estado?: number;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Debe ser un número' })
  readonly id?: number;
}
