/*
  Warnings:

  - You are about to drop the column `nombre` on the `estado` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `origen_producto` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `permiso` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `rol` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre_estado]` on the table `estado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre_origen]` on the table `origen_producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre_permiso]` on the table `permiso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre_producto]` on the table `productos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre_rol]` on the table `rol` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre_estado` to the `estado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_origen` to the `origen_producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_permiso` to the `permiso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_producto` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_rol` to the `rol` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "estado_nombre_key";

-- DropIndex
DROP INDEX "permiso_nombre_key";

-- DropIndex
DROP INDEX "rol_nombre_key";

-- AlterTable
ALTER TABLE "estado" DROP COLUMN "nombre",
ADD COLUMN     "nombre_estado" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "origen_producto" DROP COLUMN "nombre",
ADD COLUMN     "nombre_origen" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "permiso" DROP COLUMN "nombre",
ADD COLUMN     "nombre_permiso" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "nombre",
ADD COLUMN     "nombre_producto" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rol" DROP COLUMN "nombre",
ADD COLUMN     "nombre_rol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "estado_nombre_estado_key" ON "estado"("nombre_estado");

-- CreateIndex
CREATE UNIQUE INDEX "origen_producto_nombre_origen_key" ON "origen_producto"("nombre_origen");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_nombre_permiso_key" ON "permiso"("nombre_permiso");

-- CreateIndex
CREATE UNIQUE INDEX "productos_nombre_producto_key" ON "productos"("nombre_producto");

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_rol_key" ON "rol"("nombre_rol");
