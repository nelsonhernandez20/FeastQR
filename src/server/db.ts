import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

// Evitar múltiples instancias de PrismaClient en desarrollo
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configuración para evitar el error de declaraciones preparadas duplicadas
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Configuración para evitar el error de declaraciones preparadas duplicadas
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });
};

// Asegurarse de que solo haya una instancia de PrismaClient
export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Manejar señales de terminación para cerrar conexiones correctamente
process.on("beforeExit", async () => {
  await db.$disconnect();
});

process.on("SIGINT", async () => {
  await db.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await db.$disconnect();
  process.exit(0);
});
