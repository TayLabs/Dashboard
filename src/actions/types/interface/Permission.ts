import type { UUID } from 'node:crypto';

export type Permission = {
  authId?: UUID;
  keysId?: UUID;
  key: string;
  description: string;
};
