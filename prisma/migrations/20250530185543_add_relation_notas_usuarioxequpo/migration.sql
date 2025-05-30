/*
  Warnings:

  - You are about to drop the column `id_categoria` on the `cedula_deportiva` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cedula_deportiva" DROP CONSTRAINT "cedula_deportiva_id_categoria_fkey";

-- AlterTable
ALTER TABLE "cedula_deportiva" DROP COLUMN "id_categoria";

-- AlterTable
ALTER TABLE "usuario_x_equipo" ADD COLUMN     "id_nota" INTEGER;

-- AddForeignKey
ALTER TABLE "usuario_x_equipo" ADD CONSTRAINT "usuario_x_equipo_id_nota_fkey" FOREIGN KEY ("id_nota") REFERENCES "notas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
