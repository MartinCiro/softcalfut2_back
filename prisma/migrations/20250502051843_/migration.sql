/*
  Warnings:

  - The primary key for the `usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellido` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `id_estado` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `origen_producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[documento]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documento` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado_id` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom_user` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_id_estado_fkey";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_id_origen_fkey";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_id_estado_fkey";

-- DropIndex
DROP INDEX "usuario_username_key";

-- AlterTable
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_pkey",
DROP COLUMN "apellido",
DROP COLUMN "id",
DROP COLUMN "id_estado",
DROP COLUMN "username",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "documento" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "estado_id" INTEGER NOT NULL,
ADD COLUMN     "fecha_nacimiento" TIMESTAMP(3),
ADD COLUMN     "fecha_usuario_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "info_perfil" TEXT,
ADD COLUMN     "nom_user" TEXT NOT NULL,
ADD COLUMN     "num_contacto" TEXT,
ADD CONSTRAINT "usuario_pkey" PRIMARY KEY ("documento");

-- DropTable
DROP TABLE "origen_producto";

-- DropTable
DROP TABLE "productos";

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nombre_categoria" TEXT,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cedula_deportiva" (
    "id" SERIAL NOT NULL,
    "fecha_creacion_deportiva" TIMESTAMP(3),
    "estado_cedula" INTEGER,
    "id_categoria" INTEGER,
    "id_torneo" INTEGER,
    "fecha_registro_cedula" TIMESTAMP(3),
    "id_equipo" TEXT,
    "id_foto" INTEGER,

    CONSTRAINT "cedula_deportiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipo" (
    "id" TEXT NOT NULL,
    "nom_equipo" TEXT,
    "documento" TEXT,

    CONSTRAINT "equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id" SERIAL NOT NULL,
    "base" TEXT,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lcf" (
    "id" SERIAL NOT NULL,
    "id_equipo" TEXT,
    "documento" TEXT,

    CONSTRAINT "lcf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programacion" (
    "id" SERIAL NOT NULL,
    "rama" INTEGER,
    "categoria_encuentro" TEXT,
    "lugar_encuentro" TEXT,
    "fecha_encuentro" TIMESTAMP(3),
    "nombre_competencia" TEXT,
    "id_lcf" INTEGER,
    "fase" TEXT,
    "equipo_local" TEXT,
    "quipo_visitante" TEXT,
    "id_equipo" TEXT,

    CONSTRAINT "programacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "torneos" (
    "id" SERIAL NOT NULL,
    "nombre_torneo" TEXT,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarioxequipo" (
    "id_equipo" TEXT NOT NULL,
    "documento_user" TEXT NOT NULL,

    CONSTRAINT "usuarioxequipo_pkey" PRIMARY KEY ("id_equipo","documento_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_documento_key" ON "usuario"("documento");

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "torneos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_foto_fkey" FOREIGN KEY ("id_foto") REFERENCES "fotos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "equipo_documento_fkey" FOREIGN KEY ("documento") REFERENCES "usuario"("documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_id_lcf_fkey" FOREIGN KEY ("id_lcf") REFERENCES "lcf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarioxequipo" ADD CONSTRAINT "usuarioxequipo_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarioxequipo" ADD CONSTRAINT "usuarioxequipo_documento_user_fkey" FOREIGN KEY ("documento_user") REFERENCES "usuario"("documento") ON DELETE CASCADE ON UPDATE CASCADE;
