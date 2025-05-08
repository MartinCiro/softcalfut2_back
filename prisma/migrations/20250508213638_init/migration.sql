-- CreateTable
CREATE TABLE "anuncio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "id_fecha_creacion" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anuncio_titulo_key" ON "anuncio"("titulo");

-- AddForeignKey
ALTER TABLE "anuncio" ADD CONSTRAINT "anuncio_id_fecha_creacion_fkey" FOREIGN KEY ("id_fecha_creacion") REFERENCES "Fecha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anuncio" ADD CONSTRAINT "anuncio_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
