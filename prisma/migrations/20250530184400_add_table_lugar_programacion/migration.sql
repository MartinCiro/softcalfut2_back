/*
  Warnings:

  - The `lugar_encuentro` column on the `programacion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "programacion" DROP COLUMN "lugar_encuentro",
ADD COLUMN     "lugar_encuentro" INTEGER;

-- CreateTable
CREATE TABLE "lugar_encuentro" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "direccion" TEXT,

    CONSTRAINT "lugar_encuentro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_lugar_encuentro_fkey" FOREIGN KEY ("lugar_encuentro") REFERENCES "lugar_encuentro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
