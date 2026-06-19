import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {

  constructor(@Inject(BROWSER_STORAGE) private storage: Storage) {}

  public setData(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  public getData(key: string): string|null {
    return this.storage.getItem(key)
  }

  public setObject<T>(key: string, value: T|null): void {
    if (value === null) {
      this.remove(key);
      return;
    }

    this.storage.setItem(key, JSON.stringify(value));
  }

  public getObject<T>(key: string): T|null {
    const data = this.storage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  public remove(key: string): void {
    this.storage.removeItem(key);
  }

  public clearData(): void {
    this.storage.clear();
  }
}
