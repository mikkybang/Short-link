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
});
