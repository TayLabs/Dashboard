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
      case 'Path':
        parsed.path = valueString;
        break;
      case 'Domain':
        parsed.domain = valueString;
        break;
      case 'Expires':
        console.log('Parsing Expires date: ', valueString);
        parsed.expires = new Date(valueString);
        break;
      case 'MaxAge':
        parsed.maxAge = parseInt(valueString);
        break;
      case 'Secure':
        parsed.secure = true;
        break;
      case 'HttpOnly':
        parsed.httpOnly = true;
        break;
      case 'SameSite':
        parsed.sameSite = valueString as CookieSameSite;
        break;
    }
  }

  return parsed;
}
