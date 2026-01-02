import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export function parseCookie(cookie: string): ResponseCookie {
	const [val, ...options] = cookie.split(';');

	const [name, value] = val.split('=');
	const parsed: ResponseCookie = {
		name,
		value,
	};

	for (const option of options) {
		const [key, valueString] = option.split('=');

		switch (key) {
			case 'path':
				parsed.path = valueString;
				break;
			case 'domain':
				parsed.domain = valueString;
				break;
			case 'expires':
				parsed.expires = parseInt(valueString);
				break;
			case 'maxAge':
				parsed.maxAge = parseInt(valueString);
				break;
			case 'secure':
				parsed.secure = valueString === 'true';
				break;
			case 'httpOnly':
				parsed.httpOnly = valueString === 'true';
				break;
			case 'sameSite':
				parsed.sameSite = valueString as CookieSameSite;
				break;
		}
	}

	return parsed;
}
