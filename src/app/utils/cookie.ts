import { CookieService, CookieOptions } from 'ngx-cookie';
import { isString } from './utils';


export class AppCookie {
    constructor(private cookieService: CookieService) {}

    getCookie(key: string): string {
        return this.cookieService.get(key);
    }

    getCookieObject(key: string): any {
        return this.cookieService.getObject(key);
    }

    setCookie(key: string, value: any, options?: CookieOptions): void {
        if (!isString(value)) {
            return this.cookieService.putObject(key, value, options);
        }

        return this.cookieService.put(key, value, options);
    }

    clear(key?: string): void {
        return (key) ? this.cookieService.remove(key) : this.cookieService.removeAll();
    }
}
