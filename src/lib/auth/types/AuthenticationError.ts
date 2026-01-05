export type AuthenticationErrorCode =
  | 'UNKN' // Unknown Error
  | 'NATH' // Not Authorized
  | 'NFND' // No Active Session Found
  | 'TRFS' // Token Refreshing
  | 'P2FA' // Pending 2FA
  | 'PEMV' // Pending Email Verification
  | 'PPRS'; // Pending Password Reset

class AuthenticationError extends Error {
  public code: AuthenticationErrorCode;

  constructor(message: string, code: AuthenticationErrorCode) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, AuthenticationError.prototype); // Prevent any bugs with extending built-in classes
  }
}

class Pending2FAError extends AuthenticationError {
  constructor(message: string) {
    super(message, 'P2FA');
  }
}
class PendingEmailVerificationError extends AuthenticationError {
  constructor(message: string) {
    super(message, 'PEMV');
  }
}
class PendingPasswordResetError extends AuthenticationError {
  constructor(message: string) {
    super(message, 'PPRS');
  }
}

export {
  AuthenticationError as default,
  Pending2FAError,
  PendingEmailVerificationError,
  PendingPasswordResetError,
};
