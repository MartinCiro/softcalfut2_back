/*
  Warnings:

  - You are about to drop the column `fecha_nacimiento` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_usuario_registro` on the `usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "fecha_nacimiento",
DROP COLUMN "fecha_usuario_registro",
ADD COLUMN     "id_fecha_nacimiento" INTEGER,
ADD COLUMN     "id_fecha_registro" INTEGER;

-- CreateTable
CREATE TABLE "Fecha" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fecha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fecha_fecha_key" ON "Fecha"("fecha");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_fecha_nacimiento_fkey" FOREIGN KEY ("id_fecha_nacimiento") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_fecha_registro_fkey" FOREIGN KEY ("id_fecha_registro") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
