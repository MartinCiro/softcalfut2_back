import { IsNotEmpty, IsNumber } from 'class-validator';

export class EliminarNotaDto {
  @IsNotEmpty({ message: 'El id del nota es obligatorio' })
  @IsNumber({}, { message: 'El id del nota debe ser un número' })
  readonly id!: number | string
}
