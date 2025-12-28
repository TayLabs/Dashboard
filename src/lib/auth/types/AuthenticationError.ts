export type AuthenticationErrorCode = 'Pend_Two_FA';

export default class AuthenticationError extends Error {
	public code: AuthenticationErrorCode;

	constructor(message: string, code: AuthenticationErrorCode) {
		super(message);
		this.code = code;
		Object.setPrototypeOf(this, AuthenticationError.prototype); // Prevent any bugs with extending built-in classes
	}
}
