import { PrismaClient } from '@prisma/client';

import { RoleName } from './role.type';

const prisma = new PrismaClient();

const getRoleByName = async (name: RoleName) => {
  const role = await prisma.role.findUnique({
    where: {
      name,
    },
  });

  return role;
};

const getRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};

export const roleService = {
  getRoleByName,
  getRoles,
};
