type Cookie = {
	name: string;
	value: string;
	options?: {
		path?: string;
		domain?: string;
		expires?: Date;
		maxAge?: number;
		secure?: boolean;
		httpOnly?: boolean;
		sameSite?: 'lax' | 'strict' | 'none';
	};
};

export function parseCookie(cookie: string): Cookie {
	const [val, ...options] = cookie.split(';');

	const [name, value] = val.split('=');
	const parsed: Cookie = {
		name,
		value,
	};

	if (options.length > 0) {
		parsed.options = {} as Cookie['options'];
		for (const option of options) {
			const [key, valueString] = option.split('=');

			switch (key) {
				case 'path':
					parsed.options!.path = valueString;
					break;
				case 'domain':
					parsed.options!.domain = valueString;
					break;
				case 'expires':
					parsed.options!.expires = new Date(valueString);
					break;
				case 'maxAge':
					parsed.options!.maxAge = parseInt(valueString);
					break;
				case 'secure':
					parsed.options!.secure = valueString === 'true';
					break;
				case 'httpOnly':
					parsed.options!.httpOnly = valueString === 'true';
					break;
				case 'sameSite':
					parsed.options!.sameSite = valueString as NonNullable<
						Cookie['options']
					>['sameSite'];
					break;
			}
		}
	}

	return parsed;
}
