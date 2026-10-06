// Creates or promotes a VALPAR_ADMIN user so someone can sign in to the web CMS.
// Usage: npm run create-admin -- <email> <password> [name]
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

async function main() {
  const [email, password, name = 'Administrador VALPAR'] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Uso: npm run create-admin -- <email> <contraseña> [nombre]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('La contraseña de administrador debe tener al menos 8 caracteres.');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: 'VALPAR_ADMIN' },
      create: { email, name, passwordHash, role: 'VALPAR_ADMIN' }
    });
    console.log(`✅ Administrador listo: ${user.email} (id ${user.id}). Ya puede iniciar sesión en el CMS.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(err => {
  console.error('❌ No se pudo crear el administrador:', err.message || err);
  process.exit(1);
});
