/*
  Warnings:

  - The `id_equipo` column on the `cedula_deportiva` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `equipo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `equipo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_equipo` column on the `programacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `usuarioxequipo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cedula_deportiva" DROP CONSTRAINT "cedula_deportiva_id_equipo_fkey";

-- DropForeignKey
ALTER TABLE "programacion" DROP CONSTRAINT "programacion_id_equipo_fkey";

-- DropForeignKey
ALTER TABLE "usuarioxequipo" DROP CONSTRAINT "usuarioxequipo_documento_user_fkey";

-- DropForeignKey
ALTER TABLE "usuarioxequipo" DROP CONSTRAINT "usuarioxequipo_id_equipo_fkey";

-- AlterTable
ALTER TABLE "cedula_deportiva" DROP COLUMN "id_equipo",
ADD COLUMN     "id_equipo" INTEGER;

-- AlterTable
ALTER TABLE "equipo" DROP CONSTRAINT "equipo_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "equipo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "programacion" DROP COLUMN "id_equipo",
ADD COLUMN     "id_equipo" INTEGER;

-- DropTable
DROP TABLE "usuarioxequipo";

-- CreateTable
CREATE TABLE "usuario_x_equipo" (
    "id_equipo" INTEGER NOT NULL,
    "documento_user" TEXT NOT NULL,

    CONSTRAINT "usuario_x_equipo_pkey" PRIMARY KEY ("id_equipo","documento_user")
);

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_x_equipo" ADD CONSTRAINT "usuario_x_equipo_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_x_equipo" ADD CONSTRAINT "usuario_x_equipo_documento_user_fkey" FOREIGN KEY ("documento_user") REFERENCES "usuario"("documento") ON DELETE CASCADE ON UPDATE CASCADE;
