import { IsString, IsOptional, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class ActualizarLugarEncuentroDto {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre del lugar de encuentro es obligatorio' })
  @IsString({ message: 'El texto del nombre en lugar de encuentro no es válido' })
  readonly nombre?: string

  @IsOptional()
  @IsNotEmpty({ message: 'La direccion del lugar de encuentro es obligatoria' })
  @IsString({ message: 'El texto de la direccion del lugar de encuentro no es válido' })
  readonly direccion?: string

  @IsNotEmpty({ message: 'El id del lugar de encuentro es obligatorio' })
  @IsNumber({}, { message: 'El id del lugar de encuentro debe ser un número' })
  readonly id!: number | string
}
