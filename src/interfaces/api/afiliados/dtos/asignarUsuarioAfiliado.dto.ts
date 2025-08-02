import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class AsignarUsuarioAfiliadoDto {
  @IsNotEmpty({ message: 'El nombre del afiliado es obligatorio' })
  @IsString({ message: 'El texto del nombre del afiliado no es valido' })
  readonly nombre_afiliado!: string

  @IsNotEmpty({ message: 'La lista de jugadores es obligatoria' })
  @IsArray({ message: 'La lista de jugadores no es valida' })
  readonly jugadores!: string[]
}

