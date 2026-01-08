import { UUID } from 'node:crypto';
import { Permission } from './Permission';

export type Key = {
  id: UUID;
  serviceId: UUID;
  name: string;
  keyLastFour: string;
  createdAt: Date;
  expiresAt: Date;
  permissions: Permission[];
};
