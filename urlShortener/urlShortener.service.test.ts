import "reflect-metadata";
import { Container } from "typedi";
import { Database } from "../database/database";
import { UrlShortenerService } from "./urlShortener.service";

describe("UrlShortenerService", () => {
  let urlShortenerService: UrlShortenerService;
  let mockDb: Database;

  beforeEach(() => {
    // Register the mock Database class
    Container.set(Database, new Database());

    // Get an instance of UrlShortenerService
    urlShortenerService = Container.get(UrlShortenerService);
    mockDb = Container.get(Database);
  });
});
