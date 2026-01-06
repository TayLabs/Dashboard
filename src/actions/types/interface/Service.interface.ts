import type { UUID } from 'node:crypto';
import type { Permission } from './Permission';

export type Service = {
  authId?: UUID;
  keysId?: UUID;
  isExternal: boolean;
  name: string;
  permissions: Permission[];
};
