import request from "supertest";
import express, { Express } from "express";
import { Container } from "typedi";

import UrlShortenerController from "./urlShortener.controller";
import { Database } from "../database/database";
import { InMemoryDatabase } from "../database/inMemoryDatabase/inMemoryDatabase";
import { UrlShortenerService } from "./urlShortener.service";

describe("UrlShortenerController e2e test", () => {
  let app: Express;

  beforeAll(() => {
    app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    Container.set(Database, new InMemoryDatabase());

    Container.set(
      UrlShortenerService,
      new UrlShortenerService(Container.get(Database))
    );
    new UrlShortenerController(Container.get(UrlShortenerService), app);
  });

  test("should encode and store a URL", async () => {
    const originalUrl = "http://example.com";

    const response = await request(app)
      .post("/encode")
      .send({ url: originalUrl })
      .expect(201);

    expect(response.body.data.originalUrl).toBe(originalUrl);
  });
});
