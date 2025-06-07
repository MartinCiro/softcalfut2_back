-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nombre_categoria" TEXT,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cedula_deportiva" (
    "id" SERIAL NOT NULL,
    "id_fecha_creacion_deportiva" INTEGER NOT NULL,
    "estado_cedula" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_torneo" INTEGER NOT NULL,
    "id_fecha_actualizacion" INTEGER NOT NULL,
    "id_equipo" INTEGER NOT NULL,
    "foto_base" TEXT,

    CONSTRAINT "cedula_deportiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipo" (
    "id" SERIAL NOT NULL,
    "nom_equipo" TEXT NOT NULL,
    "documento" TEXT NOT NULL,

    CONSTRAINT "equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado" (
    "id" SERIAL NOT NULL,
    "nombre_estado" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fecha" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fecha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permiso" (
    "id" SERIAL NOT NULL,
    "nombre_permiso" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programacion" (
    "id" SERIAL NOT NULL,
    "rama" TEXT NOT NULL,
    "categoria_encuentro" INTEGER NOT NULL,
    "lugar_encuentro" TEXT NOT NULL,
    "fecha_encuentro" INTEGER NOT NULL,
    "cronograma_juego" TEXT NOT NULL,
    "id_equipo_local" INTEGER NOT NULL,
    "id_equipo_visitante" INTEGER NOT NULL,

    CONSTRAINT "programacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_x_permiso" (
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,

    CONSTRAINT "rol_x_permiso_pkey" PRIMARY KEY ("id_rol","id_permiso")
);

-- CreateTable
CREATE TABLE "torneos" (
    "id" SERIAL NOT NULL,
    "nombre_torneo" TEXT,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_x_equipo" (
    "id_equipo" INTEGER NOT NULL,
    "documento_user" TEXT NOT NULL,

    CONSTRAINT "usuario_x_equipo_pkey" PRIMARY KEY ("id_equipo","documento_user")
);

-- CreateTable
CREATE TABLE "usuario" (
    "documento" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "info_perfil" TEXT,
    "num_contacto" TEXT,
    "nom_user" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "id_fecha_nacimiento" INTEGER,
    "id_fecha_registro" INTEGER,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("documento")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipo_nom_equipo_key" ON "equipo"("nom_equipo");

-- CreateIndex
CREATE UNIQUE INDEX "equipo_documento_key" ON "equipo"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "estado_nombre_estado_key" ON "estado"("nombre_estado");

-- CreateIndex
CREATE UNIQUE INDEX "Fecha_fecha_key" ON "Fecha"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_nombre_permiso_key" ON "permiso"("nombre_permiso");

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_rol_key" ON "rol"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_documento_key" ON "usuario"("documento");

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "torneos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_fecha_actualizacion_fkey" FOREIGN KEY ("id_fecha_actualizacion") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_id_fecha_creacion_deportiva_fkey" FOREIGN KEY ("id_fecha_creacion_deportiva") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cedula_deportiva" ADD CONSTRAINT "cedula_deportiva_estado_cedula_fkey" FOREIGN KEY ("estado_cedula") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipo" ADD CONSTRAINT "equipo_documento_fkey" FOREIGN KEY ("documento") REFERENCES "usuario"("documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_id_equipo_local_fkey" FOREIGN KEY ("id_equipo_local") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_id_equipo_visitante_fkey" FOREIGN KEY ("id_equipo_visitante") REFERENCES "equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_fecha_encuentro_fkey" FOREIGN KEY ("fecha_encuentro") REFERENCES "Fecha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programacion" ADD CONSTRAINT "programacion_categoria_encuentro_fkey" FOREIGN KEY ("categoria_encuentro") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_x_permiso" ADD CONSTRAINT "rol_x_permiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_x_permiso" ADD CONSTRAINT "rol_x_permiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_x_equipo" ADD CONSTRAINT "usuario_x_equipo_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_x_equipo" ADD CONSTRAINT "usuario_x_equipo_documento_user_fkey" FOREIGN KEY ("documento_user") REFERENCES "usuario"("documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_fecha_nacimiento_fkey" FOREIGN KEY ("id_fecha_nacimiento") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_fecha_registro_fkey" FOREIGN KEY ("id_fecha_registro") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;
