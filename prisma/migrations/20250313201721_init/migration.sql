-- DropForeignKey
ALTER TABLE "rol_x_permiso" DROP CONSTRAINT "rol_x_permiso_id_permiso_fkey";

-- DropForeignKey
ALTER TABLE "rol_x_permiso" DROP CONSTRAINT "rol_x_permiso_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_id_rol_fkey";

-- AddForeignKey
ALTER TABLE "rol_x_permiso" ADD CONSTRAINT "rol_x_permiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_x_permiso" ADD CONSTRAINT "rol_x_permiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
