import type { UUID } from 'node:crypto';

export type User = {
  id: UUID;
  email: string;
  emailVerified: boolean;
  forcePasswordChange: boolean;
  phoneNumber: string | null;
  phoneTwoFactorEnabled: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  profile: Profile;
};

export type Profile = {
  id: UUID;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  updatedAt: Date;
};
