import { Injectable } from '@angular/core';

/**
 * Acceso tipado a `localStorage` con manejo de errores (modo privado o
 * cuota llena no rompen la app) y claves con prefijo `ml_`.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly PREFIX = 'ml_';

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      console.error(`[LocalStorage] No se pudo leer "${key}":`, err);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.error(`[LocalStorage] No se pudo guardar "${key}":`, err);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (err) {
      console.error(`[LocalStorage] No se pudo borrar "${key}":`, err);
    }
  }
}
