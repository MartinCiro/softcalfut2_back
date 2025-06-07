-- AlterTable
ALTER TABLE "usuario_x_equipo" ADD COLUMN     "id_estado" INTEGER;

-- AddForeignKey
ALTER TABLE "usuario_x_equipo" ADD CONSTRAINT "usuario_x_equipo_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
