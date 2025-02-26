import { IsEmail } from 'class-validator';

export class EliminarUsuarioDto {
  @IsEmail()
    email!: string;
}
