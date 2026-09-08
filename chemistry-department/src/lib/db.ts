/**
 * Database abstraction layer.
 *
 * Currently the project uses local/static data.
 * Later this layer can communicate with the Django backend.
 */

export const database = {
  async get<T>(): Promise<T[]> {
    return [];
  },

  async find<T>(): Promise<T | null> {
    return null;
  },

  async create<T>(data: T): Promise<T> {
    return data;
  },

  async update<T>(data: Partial<T>): Promise<T> {
    return data as T;
  },

  async remove(): Promise<boolean> {
    return true;
  },
};