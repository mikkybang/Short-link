import "reflect-metadata";
import { Container } from "typedi";
import { Database } from "../database/database";
import { UrlEntity, UrlShortenerService } from "./urlShortener.service";
import { InMemoryDatabase } from "../database/inMemoryDatabase/inMemoryDatabase";

describe("UrlShortenerService", () => {
  let urlShortenerService: UrlShortenerService;
  let mockDb: Database;

  beforeAll(() => {
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

  it("should decode a URL", async () => {
    const originalUrl = "http://example.com";
    const hash = "testHash";
    const shortUrl = `http://testUrl.com/${hash}`;

    await mockDb.set(hash, {
      hash: hash,
      originalUrl: originalUrl,
      sources: {},
      createdAt: new Date(),
      lastHitAt: null,
    });
    const decodedUrl = await urlShortenerService.decodeUrl(shortUrl);
    expect(decodedUrl).toBe(originalUrl);
  });

  it("should retrieve URL Statistics", async () => {
    const originalUrl = "http://example.com";
    const hash = "testHash";

    await mockDb.set(hash, {
      hash: hash,
      originalUrl: originalUrl,
      sources: {
        google: 2,
        facebook: 1,
        twitter: 3,
      },
      createdAt: new Date(),
      lastHitAt: new Date(),
    });

    const stats = await urlShortenerService.getUrlStatistics(hash);
    expect(stats.totalHits).toBe(6);
  });

  it("should hit url and update source", async () => {
    const originalUrl = "http://example.com";
    const hash = "testHash";

    await mockDb.set(hash, {
      hash: hash,
      originalUrl: originalUrl,
      sources: {
        google: 2,
        facebook: 1,
        twitter: 3,
      },
      createdAt: new Date(),
      lastHitAt: new Date(),
    });

    const decodedUrl = await urlShortenerService.hitUrl(hash, "google");
    await urlShortenerService.hitUrl(hash);
    expect(decodedUrl).toBe(originalUrl);

    const stats = await urlShortenerService.getUrlStatistics(hash);

    expect(stats.sources["google"]).toBe(3);
    expect(stats.sources["unknown"]).toBe(1);
    expect(stats.totalHits).toBe(8);
  });

  it("should throw error if url not found", async () => {
    const hash = "testHash";
    try {
      await urlShortenerService.getUrlStatistics(hash);
    } catch (error: any) {
      expect(error.message).toBe("url not found");
    }
  });

  it("should throw invalid url error", async () => {
    const shortUrl = "invalidTestUrl";
    try {
      await urlShortenerService.encodeUrl(shortUrl);
    } catch (error: any) {
      expect(error.message).toBe("invalid url");
    }
  });
});
