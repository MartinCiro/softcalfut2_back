/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_id_estado_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_id_rol_fkey";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "usuario"("username");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
