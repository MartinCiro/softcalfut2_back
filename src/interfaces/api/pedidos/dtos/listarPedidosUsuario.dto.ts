import { IsOptional, IsEmail } from 'class-validator';

export class ListarPedidosUsuarioDto {
  @IsOptional({ message: 'El correo del usuario es obligatorio' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email!: string;
}
