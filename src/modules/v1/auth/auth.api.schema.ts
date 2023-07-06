import { z } from '../../../lib/zod';

import { roleService } from '../role/role.service';

const validateBusinessIdForClientRole = async (data: { roleId: string; businessId?: string }) => {
  // if role is client, businessId is required
  const businessRole = await roleService.getRoleByName('client');
  if (data.roleId === businessRole?.id) {
    return data.businessId !== undefined;
  }
  return true;
};

const disallowRegisterAsAdmin = async (data: { roleId: string }) => {
  // do not allow to register as admin
  const adminRole = await roleService.getRoleByName('admin');
  return data.roleId !== adminRole?.id;
};

// regex for password validation with at least 1 uppercase, at least 1 lowercase, 1 number or symbol and minimum 10 characters
const passwordRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9!@#$%^&*]).{10,}$');

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 10 characters long with at least one uppercase, one lower case and one number or symbol character.',
      ),
    fullName: z.string(),
    businessId: z.string().optional(),
    phone: z.string().optional(),
    roleId: z.string(),
    ndaAccepted: z.boolean().refine((value) => value === true, {
      message: 'NDA must be accepted',
    }),
  })
  .refine(validateBusinessIdForClientRole, {
    message: 'Business ID is required for clients',
    path: ['businessId'],
  })
  .refine(disallowRegisterAsAdmin, {
    message: 'Cannot register as admin',
    path: ['roleId'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
