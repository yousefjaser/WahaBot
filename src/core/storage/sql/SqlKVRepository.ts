import { Field, Schema } from '@waha/core/storage/Schema';
import { ISQLEngine } from '@waha/core/storage/sql/ISQLEngine';
import { Sqlite3Engine } from '@waha/core/storage/sqlite3/Sqlite3Engine';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { KnexPaginator } from '@waha/utils/Paginator';
import Knex from 'knex';

export type Migration = string;

export class SqlKVRepository<Entity> {
  protected UPSERT_BATCH_SIZE = 100;
  protected Paginator = KnexPaginator;

  get schema(): Schema {
    throw new Error('Not implemented');
  }

  get metadata(): Map<string, (entity: Entity) => any> {
    return new Map();
  }

  get migrations(): Migration[] {
    return [];
  }

  constructor(
    private engine: ISQLEngine,
    protected knex: Knex.Knex,
  ) {}

  get columns(): Field[] {
    return this.schema.columns;
  }

  get table(): string {
    return this.schema.name;
  }

  /**
   * Migrations
   */
  async init(): Promise<void> {
    await this.applyMigrations();
    await this.validateSchema();
  }

  protected async applyMigrations() {
    for (const migration of this.migrations) {
      await this.engine.exec(migration);
    }
  }

  protected async validateSchema() {
    return;
  }

  /**
   * Update methods
   */
  save(entity: Entity) {
    return this.upsertOne(entity);
  }

  async upsertOne(entity: Entity): Promise<void> {
    await this.upsertMany([entity]);
  }

  async upsertMany(entities: Entity[]): Promise<void> {
    if (entities.length === 0) {
      return;
    }
    const batchSize = this.UPSERT_BATCH_SIZE;
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      await this.upsertBatch(batch);
    }
  }

  private async upsertBatch(entities: Entity[]): Promise<void> {
    const data = entities.map((entity) => this.dump(entity));
    const keys = this.columns.map((c) => c.fieldName);
    const values = data.map((d) => Object.values(d)).flat();
    const sql = `INSERT INTO ${this.table} (${keys.join(', ')})
                 VALUES ${data
                   .map(() => `(${keys.map(() => '?').join(', ')})`)
                   .join(', ')}
                 ON CONFLICT(id) DO UPDATE
                     SET ${keys
                       .map((key) => `${key} = excluded.${key}`)
                       .join(', ')}`;
    try {
      await this.raw(sql, values);
    } catch (err) {
      console.error(`Error upserting data: ${err}, values: ${values}`);
      throw err;
    }
  }

  /**
   * Get methods
   */
  getAll(pagination?: PaginationParams) {
    let query = this.select();
    query = this.pagination(query, pagination);
    return this.all(query);
  }

  getAllByIds(ids: string[]) {
    return this.all(this.select().whereIn('id', ids));
  }

  getById(id: string): Promise<Entity | null> {
    return this.getBy({ id: id });
  }

  protected getAllBy(filters: any) {
    const query = this.select().where(filters);
    return this.all(query);
  }

  protected async getBy(filters: any) {
    const query = this.select().where(filters).limit(1);
    return this.get(query);
  }

  /**
   * Delete methods
   */
  async deleteAll() {
    const query = this.delete();
    await this.run(query);
  }

  async deleteById(id: string) {
    await this.deleteBy({ id: id });
  }

  protected async deleteBy(filters: any) {
    const query = this.delete().where(filters);
    await this.run(query);
  }

  /**
   * SQL Implementation details
   */
  protected async raw(sql: string, bindings: any[]): Promise<void> {
    await this.engine.raw(sql, bindings);
  }

  protected async run(query: Knex.QueryBuilder): Promise<void> {
    await this.engine.run(query);
  }

  protected async get(query: Knex.QueryBuilder): Promise<Entity | null> {
    const row = await this.engine.get(query);
    if (!row) {
      return null;
    }
    return this.parse(row);
  }

  protected async all(query: Knex.QueryBuilder): Promise<Entity[]> {
    const rows = await this.engine.all(query);
    return rows.map((row) => this.parse(row));
  }

  /**
   * SQL helpers
   */
  protected select() {
    return this.knex.select().from(this.table);
  }

  protected delete() {
    return this.knex.delete().from(this.table);
  }

  protected pagination(query: any, pagination?: PaginationParams) {
    const paginator = new this.Paginator(pagination);
    return paginator.apply(query);
  }

  /**
   * JSON helpers
   */
  protected stringify(data: any): string {
    return JSON.stringify(data);
  }

  protected parse(row: any) {
    return JSON.parse(row.data);
  }

  protected dump(entity: Entity) {
    const data = {};
    const raw = entity;
    for (const field of this.columns) {
      const fn = this.metadata.get(field.fieldName);
      if (fn) {
        data[field.fieldName] = fn(raw);
      } else if (field.fieldName == 'data') {
        data['data'] = this.stringify(raw);
      } else {
        data[field.fieldName] = raw[field.fieldName];
      }
    }
    return data;
  }
}
