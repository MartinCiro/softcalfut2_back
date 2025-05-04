import { IsNotEmpty, IsString } from 'class-validator';

export class CrearCategoriaDto {
  @IsNotEmpty({ message: 'El nombre de la categoria es obligatorio' })
  @IsString({ message: 'El texto del nombre de la categoria no es valido' })
  readonly nombre!: string
}

