import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class CrearPedidoDto {
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'Debe ser un texto válido' })
  readonly descripcion!: string;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsDate({ message: 'Debe ser una fecha válida' })
  readonly fecha!: Date;

  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_usuario!: number;

  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_estado!: number;
}
