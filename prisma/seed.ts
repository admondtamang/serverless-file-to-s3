import { PrismaClient, Role } from '@prisma/client';

import { roles } from '../src/modules/v1/role/role.constants';

const prisma = new PrismaClient();

const rolesToBeCreated = roles.map((name) => ({ name })) as Role[];

async function main() {
  await prisma.role.deleteMany();
  await prisma.role.createMany({
    data: rolesToBeCreated,
  });

  console.log('Roles created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
