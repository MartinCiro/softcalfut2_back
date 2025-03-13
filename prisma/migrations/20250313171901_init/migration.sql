/*
  Warnings:

  - You are about to drop the column `name` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `source_id` on the `productos` table. All the data in the column will be lost.
  - Added the required column `cantidad` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_origen` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notas` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio` to the `productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productos" DROP COLUMN "name",
DROP COLUMN "notes",
DROP COLUMN "price",
DROP COLUMN "quantity",
DROP COLUMN "source_id",
ADD COLUMN     "cantidad" INTEGER NOT NULL,
ADD COLUMN     "id_origen" INTEGER NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "notas" TEXT NOT NULL,
ADD COLUMN     "precio" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "origen_producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "origen_producto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_origen_fkey" FOREIGN KEY ("id_origen") REFERENCES "origen_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
