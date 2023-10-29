import { Database } from "../database";
import { InMemoryDatabase } from "./inMemoryDatabase";

describe("InMemoryDatabaseTest", () => {
  let db: Database;

  beforeEach(() => {
    db = new InMemoryDatabase();
  });

  test("should connect to in-memory database", () => {
    const connectSpy = jest.spyOn(db, "connect");
    db.connect();
    expect(connectSpy).toHaveBeenCalled();
  });

  test("should set a value in the database", async () => {
    const setSpy = jest.spyOn(db, "set");
    const value = await db.set("test", { test: "test" });
    expect(setSpy).toHaveBeenCalled();
    expect(value).toEqual({ test: "test" });
  });

  test("should get a value from the database", async () => {
    await db.set("test", { test: "test" });
    const value = await db.get("test");
    expect(value).toEqual({ test: "test" });
  });

  test("should delete a value from the database", async () => {
    await db.set("test", { test: "test" });
    await db.delete("test");
    const value = await db.get("test");
    expect(value).toBeUndefined();
  });

  test("should update a value in the database", async () => {
    await db.set("test", { test: "test" });
    const value = await db.update("test", { test: "updated", test2: "test2" });
    expect(value).toEqual({ test: "updated", test2: "test2" });
  });
});
