import { IsString } from 'class-validator';

export class EliminarPermisoDto {
  @IsString( { message: 'Debe ser un texto valido' })
  readonly id!: string;
}
