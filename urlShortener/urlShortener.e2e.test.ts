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

  test("should decode a URL", async () => {
    const originalUrl = "http://example.com";

    const shortUrlData = await request(app)
      .post("/encode")
      .send({ url: originalUrl })
      .expect(201);

    const shortUrl = `http://shortUrl/${shortUrlData.body.data.hash}`;

    const response = await request(app)
      .post("/decode")
      .send({ url: shortUrl })
      .expect(200);
    expect(response.body.data).toBe(originalUrl);
  });

  test("should retrieve URL Statistics", async () => {
    const originalUrl = "http://example.com";

    const shortUrlData = await request(app)
      .post("/encode")
      .send({ url: originalUrl })
      .expect(201);

    const hash = shortUrlData.body.data.hash;

    const response = await request(app).get(`/statistic/${hash}`).expect(200);
    expect(response.body.data.originalUrl).toEqual(originalUrl);
    expect(response.body.data.totalHits).toEqual(0);
    expect(response.body.data.sources).toEqual({});
  });

  test("should hit url and update source", async () => {
    const originalUrl = "http://example.com";

    const shortUrlData = await request(app)
      .post("/encode")
      .send({ url: originalUrl })
      .expect(201);

    const hash = shortUrlData.body.data.hash;

    await request(app).get(`/${hash}`).expect(302);

    const statsResponse = await request(app)
      .get(`/statistic/${hash}`)
      .expect(200);
    expect(statsResponse.body.data.totalHits).toEqual(1);
    expect(statsResponse.body.data.sources).toEqual({ unknown: 1 });
  });
});
