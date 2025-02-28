import { IsNotEmpty, IsEmail } from 'class-validator';

export class ListarPedidosUsuarioDto {
  @IsNotEmpty({ message: 'El correo del usuario es obligatorio' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  readonly email!: string;
}
