import { DOCUMENT, inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type SameSite = 'Lax' | 'None' | 'Strict';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: SameSite;
  partitioned?: boolean;
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class CookieService {
  private readonly document                      = inject(DOCUMENT);
  private readonly platformId                    = inject(PLATFORM_ID);
  private readonly request                       = inject(REQUEST, {optional: true});
  private readonly documentIsAccessible: boolean = isPlatformBrowser(this.platformId);

  DEFAULT_OPTIONS: CookieOptions = {}

  private static getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(/([[\]{}()|=;+?,.*^$\\])/gi, '\\$1');

    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }

  private static safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      // probably it is not uri encoded. return as is
      return encodedURIComponent;
    }
  }

  private getCookies(): string {
    if (this.documentIsAccessible) {
      return this.document.cookie
    }

    if (!this.request) {
      throw new Error('Document and Request not found.');
    }

    // Handle Angular REQUEST object (has headers.get method)
    if (this.request.headers && typeof this.request.headers.get === 'function') {
      return this.request.headers.get('cookie') ?? '';
    }

    // Handle Express request object (has headers object and get method)
    const reqAny = this.request as any;
    if (typeof reqAny.get === 'function') {
      return reqAny.get('cookie') || reqAny.get('Cookie');
    }

    // Handle direct headers object access
    const headers = this.request.headers as any;
    if (headers && typeof headers === 'object') {
      return headers['cookie'] || headers['Cookie'];
    }

    throw new Error('Cannot found cookies.');
  }

  /**
   * Return `true` if cookie with specified name exists, otherwise return `false`
   *
   * @param name Cookie name
   * @returns boolean - whether cookie with specified name exists
   */
  check(name: string): boolean {
    name                 = encodeURIComponent(name);
    const regExp: RegExp = CookieService.getCookieRegExp(name);
    return regExp.test(this.getCookies());
  }

  /**
   * Get cookies by name
   *
   * @param name Cookie name
   * @returns property value
   */
  get(name: string): string | null {
    name                 = encodeURIComponent(name);
    const regExp: RegExp = CookieService.getCookieRegExp(name);
    const result         = regExp.exec(this.getCookies());
    return result?.[1] ? CookieService.safeDecodeURIComponent(result[1]) : null;
  }

  /**
   * Get all cookies in JSON format
   *
   * @returns all the cookies in json
   */
  getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieString: any                  = this.getCookies();

    if (cookieString && cookieString !== '') {
      cookieString.split(';').forEach((currentCookie: string) => {
        const [cookieName, cookieValue]                                             = currentCookie.split('=');
        cookies[CookieService.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] = CookieService.safeDecodeURIComponent(cookieValue);
      });
    }

    return cookies;
  }

  /**
   * Set cookie based on provided information
   *
   * Cookie's parameters:
   * <pre>
   * expires  Number of days until the cookies expires or an actual `Date`
   * path     Cookie path
   * domain   Cookie domain
   * secure Cookie secure flag
   * sameSite OWASP same site token `Lax`, `None`, or `Strict`. Defaults to `Lax`
   * </pre>
   *
   * @param name     Cookie name
   * @param value    Cookie value
   * @param options  Body with cookie's params
   */
  set(
    name: string,
    value: string,
    options?: {
      expires?: number | Date;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: SameSite;
      partitioned?: boolean;
    }
  ): void {
    let cookieString: string = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    if (options === undefined || options === null) {
      options =  this.DEFAULT_OPTIONS
    }

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const dateExpires: Date = new Date(new Date().getTime() + options.expires * 1000 * 60 * 60 * 24);

        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + options.expires.toUTCString() + ';';
      }
    }

    if (options.path) {
      cookieString += 'path=' + options.path + ';';
    }

    if (options.domain) {
      cookieString += 'domain=' + options.domain + ';';
    }

    if (options.secure === false && options.sameSite === 'None') {
      options.secure = true;
      console.warn(
        `[cookie-service] Cookie ${name} was forced with secure flag because sameSite=None.` +
        `More details : https://github.com/stevermeister/ngx-cookie-service/issues/86#issuecomment-597720130`
      );
    }
    if (options.secure) {
      cookieString += 'secure;';
    }

    options.sameSite ??= 'Lax';
    cookieString += 'sameSite=' + options.sameSite + ';';

    if (options.partitioned) {
      cookieString += 'Partitioned;';
    }

    this.document.cookie = cookieString;
  }

  /**
   * Delete cookie by name at given path and domain. If not path is not specified, cookie at '/' path will be deleted.
   *
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   * @param secure Cookie secure flag
   * @param sameSite Cookie sameSite flag - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
   * @since: 1.0.0
   */
  delete(name: string, path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void {
    if (!this.documentIsAccessible) {
      return;
    }
    const expiresDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
    this.set(name, '', { expires: expiresDate, path, domain, secure, sameSite });
  }

  /**
   * Delete all cookies at given path and domain. If not path is not specified, all cookies at '/' path will be deleted.
   *
   * @param path   Cookie path
   * @param domain Cookie domain
   * @param secure Is the Cookie secure
   * @param sameSite Is the cookie same site
   */
  deleteAll(path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax'): void {
    if (!this.documentIsAccessible) {
      return;
    }

    const cookies: any = this.getAll();

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain, secure, sameSite);
      }
    }
  }
}
