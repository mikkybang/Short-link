import { Service } from "typedi";
import "reflect-metadata";

import { Database } from "../database";

@Service()
export class InMemoryDatabase extends Database {
  data: Record<string, any>;
  constructor() {
    super();
    this.data = {};
  }

  connect() {
    console.log("Connected to in-memory database");
    return;
  }

  disconnect() {
    console.log("Disconnected from in-memory database");
    return;
  }

  set<T>(
    key: string,
    value: Record<string, any>
  ): Promise<T | Record<string, any>> {
    this.data[key] = value;
    return Promise.resolve(value);
  }

  get<T>(key: string): Promise<T | Record<string, any>> {
    return this.data[key];
  }

  delete(key: string): Promise<void> {
    delete this.data[key];
    return Promise.resolve();
  }

  update<T>(
    key: string,
    value: Record<string, any>
  ): Promise<T | Record<string, any>> {
    if (!this.data[key]) {
      throw new Error("Key not found");
    }
    const existingData = this.data[key];
    this.data[key] = {
      ...existingData,
      ...value,
    };
    return Promise.resolve(this.data[key]);
  }
}
