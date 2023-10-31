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
      expect(decodedUrl).toBe(originalUrl);
      const stats = await urlShortenerService.getUrlStatistics(hash);
      if ("sources" in stats) {
        expect(stats.sources["google"]).toBe(3);
      }
    });
  });

  interface UrlStatistics {
    totalHits: number;
    sources?: Record<string, number>;
    originalUrl: string;
    hash: string;
    createdAt: Date;
    lastHitAt: Date | null;
  }

  async function getUrlStatistics(hash: string): Promise<UrlStatistics> {
    const database = Container.get(Database);
    const urlEntity = await database.get<UrlEntity>(hash);
    const totalHits = urlEntity.sources ? Object.values(urlEntity.sources).reduce((a: number, b: number) => a + b, 0) : 0;
    return {
      totalHits,
      ...(urlEntity.sources && { sources: urlEntity.sources }),
      originalUrl: urlEntity.originalUrl,
      hash: urlEntity.hash,
      createdAt: urlEntity.createdAt,
      lastHitAt: urlEntity.lastHitAt,
    };
  }
});
