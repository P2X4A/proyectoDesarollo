import { Injectable } from '@angular/core';

/**
 * Acceso tipado y seguro a `localStorage`.
 * Buenas prácticas aplicadas:
 * - Un solo lugar para serializar/deserializar JSON (sin `JSON.parse`
 *   regado por los componentes).
 * - `try/catch` en lectura y escritura (modo privado / cuota llena no
 *   deben romper la app).
 * - Claves con prefijo `ml_` para no chocar con otras apps.
 * - Fácil de mockear en tests (es un servicio inyectable).
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
