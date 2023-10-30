import "reflect-metadata";
import { Container } from "typedi";
import { Database } from "../database/database";
import { UrlEntity, UrlShortenerService } from "./urlShortener.service";
import { InMemoryDatabase } from "../database/inMemoryDatabase/inMemoryDatabase";

describe("UrlShortenerService", () => {
  let urlShortenerService: UrlShortenerService;
  let mockDb: Database;

  beforeEach(() => {
    // Register the mock Database class
    Container.set(Database, new InMemoryDatabase());

    // Get an instance of UrlShortenerService
    urlShortenerService = Container.get(UrlShortenerService);
    mockDb = Container.get(Database);
  });

  it("should encode and store a URL", async () => {
    const originalUrl = "http://example.com";

    const result = await urlShortenerService.encodeUrl(originalUrl);
    const storedUrl = await mockDb.get<UrlEntity>(result.hash);
    expect(storedUrl.originalUrl).toBe(originalUrl);
  });
});
