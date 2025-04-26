import { PrismaClient } from '@prisma/client';

async function testPrismaConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Intentar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Conexión exitosa a la base de datos');
    console.log('Resultado de la prueba:', result);
    return true;
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testPrismaConnection().then(result => {
  console.log('Resultado de la prueba:', result ? 'Éxito' : 'Fallo');
}); 