import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CrearRolxPermisoDto {
    @IsArray()  // ✅ Indica que es un array
    @ArrayNotEmpty({ message: 'La lista de permisos no puede estar vacía' }) // ✅ Asegura que tenga al menos un elemento
    @IsNumber({}, { each: true, message: 'Cada id_permiso debe ser un número' }) // ✅ Cada elemento del array debe ser un número
    readonly id_permiso!: number[];

    @IsNumber({}, { message: 'Debe ser un número' })
    readonly id_rol!: number;
}
