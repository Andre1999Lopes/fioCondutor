import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const nome = process.env.ADMIN_NAME;
  const senhaPlano = process.env.ADMIN_PASSWORD;

  if (!email || !nome || !senhaPlano) {
    throw new Error(
      'Variáveis de ambiente para seed não foram criadas. Insira-as no ambiente e tente novamente'
    );
  }

  const senhaHash = await bcrypt.hash(senhaPlano, 12);

  await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      nome,
      email,
      senha: senhaHash,
    },
  });

  console.log('✓ Usuário admin semeado:', { email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
