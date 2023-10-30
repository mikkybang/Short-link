export class Database {
  connect() {
    throw new Error("connect method must be implemented");
  }

  disconnect() {
    throw new Error("disconnect method must be implemented");
  }

  async set(
    key: string,
    value: Record<string, any>
  ): Promise<Record<string, any>> {
    throw new Error("set method must be implemented");
  }

  async get(key: string): Promise<Record<string, any>> {
    throw new Error("get method must be implemented");
  }

  async delete(key: string): Promise<void> {
    throw new Error("delete method must be implemented");
  }

  async update(
    key: string,
    value: Record<string, any>
  ): Promise<Record<string, any>> {
    throw new Error("update method must be implemented");
  }
}
