import fs from "fs";
import path from "path";

const schemaPath = path.join("prisma", "schema.prisma");
const modelsDir = path.join("prisma", "models");

const baseSchema = `
datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}

generator client {
  provider = "prisma-client-js"
}
`;

const modelFiles = fs.readdirSync(modelsDir);
const modelsContent = modelFiles.map((file) =>
  fs.readFileSync(path.join(modelsDir, file), "utf-8")
).join("\n\n");

fs.writeFileSync(schemaPath, baseSchema + "\n\n" + modelsContent);

// Ejecutar `npx prisma generate` para actualizar la base de datos