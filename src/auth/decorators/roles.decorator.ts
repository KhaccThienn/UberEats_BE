/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from '../model/role.enum';

export const ROLE_KEYS = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata('ROLE_KEYS', roles);
