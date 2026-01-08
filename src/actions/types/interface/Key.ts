import { UUID } from 'node:crypto';

export type Key = {
  id: UUID;
  name: string;
  keyLastFour: string;
  createdAt: Date;
  expiresAt: Date;
  permissions?: { id: UUID; key: string; description: string }[];
};
