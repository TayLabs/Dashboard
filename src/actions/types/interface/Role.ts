import { UUID } from 'node:crypto';
import { Permission } from './Permission';

export type Role = {
  id: UUID;
  name: string;
  assignToNewUser: boolean;
  permissions: (Omit<Permission, 'authId' | 'keysId'> & { id: UUID })[];
};
