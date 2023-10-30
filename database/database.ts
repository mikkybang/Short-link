export class Database {
  connect() {
    throw new Error("connect method must be implemented");
  }

  disconnect() {
    throw new Error("disconnect method must be implemented");
  }

  async set<T>(
    key: string,
    value: Record<string, any>
  ): Promise<T | Record<string, any>> {
    throw new Error("set method must be implemented");
  }

  async get<T>(key: string): Promise<T | Record<string, any>> {
    throw new Error("get method must be implemented");
  }

  async delete(key: string): Promise<void> {
    throw new Error("delete method must be implemented");
  }

  async update<T>(
    key: string,
    value: Record<string, any>
  ): Promise<T | Record<string, any>> {
    throw new Error("update method must be implemented");
  }
}
