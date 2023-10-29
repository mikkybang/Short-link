export abstract class Database {
  abstract connect(): void;

  abstract disconnect(): void;

  abstract set(
    key: string,
    value: Record<string, any>
  ): Promise<Record<string, any>>;

  abstract get(key: string): Promise<Record<string, any>>;

  abstract delete(key: string): Promise<void>;

  abstract update(
    key: string,
    value: Record<string, any>
  ): Promise<Record<string, any>>;
}
