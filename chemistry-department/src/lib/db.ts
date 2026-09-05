/**
 * Database abstraction layer.
 *
 * Currently the project uses local/static data.
 * Later this layer can communicate with the Django backend.
 */

export const database = {
  async get<T>(_collection: string): Promise<T[]> {
    return [];
  },

  async find<T>(
    _collection: string,
    _id: string
  ): Promise<T | null> {
    return null;
  },

  async create<T>(
    _collection: string,
    data: T
  ): Promise<T> {
    return data;
  },

  async update<T>(
    _collection: string,
    _id: string,
    data: Partial<T>
  ): Promise<T> {
    return data as T;
  },

  async remove(
    _collection: string,
    _id: string
  ): Promise<boolean> {
    return true;
  },
};