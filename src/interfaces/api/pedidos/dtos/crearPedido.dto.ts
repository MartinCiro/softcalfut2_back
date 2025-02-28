import { IsOptional, IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearPedidoDto {
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'Debe ser un texto válido' })
  readonly descripcion!: string;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @Type(() => Date)  // Convierte el string en un objeto Date
  @IsDate({ message: 'Debe ser una fecha válida' })
  readonly fecha!: Date;

  @IsOptional({ message: 'El usuario es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_usuario!: number;

  @IsOptional({ message: 'El estado es obligatorio' })
  @IsNumber({}, { message: 'Debe ser un número' })
  readonly id_estado!: number;
}
