import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Leer el archivo SQL
    const migrationPath = path.join(process.cwd(), 'prisma/migrations/init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Ejecutar el SQL
    console.log('Ejecutando migración...');
    await prisma.$executeRawUnsafe(sql);
    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
runMigration().then(() => {
  console.log('Proceso de migración finalizado');
}); 