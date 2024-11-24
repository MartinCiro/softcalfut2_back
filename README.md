docker exec psql pg_dump -U postgres -d softcalfutPSQL -F c -f /tmp/backup.db #crear copia de seguridad
docker cp psql:/tmp/backup.db ./backup.db #Moverla a local
docker exec -i psql pg_restore -U postgres -d softcalfut_psql < ~/backup.db #Restaurar bd
