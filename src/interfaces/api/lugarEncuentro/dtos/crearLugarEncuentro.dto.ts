import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearLugarEncuentroDto {
  @IsNotEmpty({ message: 'El nombre de la nota es obligatorio' })
  @IsString({ message: 'El texto del nombre en la nota no es válido' })
  readonly nombre!: string

  @IsOptional()
  @IsNotEmpty({ message: 'La direccion del lugar de encuentro es obligatoria' })
  @IsString({ message: 'El texto de la direccion del lugar de encuentro no es válido' })
  readonly direccion?: string
}

