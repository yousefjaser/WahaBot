import { IJsonQuery } from '@waha/core/storage/sql/IJsonQuery';

export class Sqlite3JsonQuery implements IJsonQuery {
  filter(field: string, key: string): string {
    const jsonPath = `$.${key}`;
    return `${field}->'${jsonPath}' = ?`;
  }

  sortBy(field: string, sortBy: string, direction: string): string {
    const jsonPath = `$.${sortBy}`;
    return `${field}->'${jsonPath}' ${direction}`;
  }
}
