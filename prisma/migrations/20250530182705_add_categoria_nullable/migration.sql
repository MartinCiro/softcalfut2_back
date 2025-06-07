/*
  Warnings:

  - You are about to drop the column `categoria_encuentro` on the `programacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "equipo" ADD COLUMN     "categoria" INTEGER;

-- AlterTable
ALTER TABLE "programacion" DROP COLUMN "categoria_encuentro";

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "equipo_categoria_fkey" FOREIGN KEY ("categoria") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
