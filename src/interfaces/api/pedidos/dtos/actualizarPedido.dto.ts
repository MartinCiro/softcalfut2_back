import { IsOptional, IsNumber, IsString, IsDate, IsEmail } from 'class-validator';

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

  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  readonly email?: string;
}
