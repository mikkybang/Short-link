import { Service } from "typedi";
import "reflect-metadata";
import * as crypto from "crypto";

import { Database } from "../database/database";

export interface UrlEntity {
  originalUrl: string;
  hash: string;
  sources: Record<string, number>;
  createdAt: Date;
  lastHitAt: Date | null;
}

interface UrlStatistics {
  totalHits: number;
  sources?: Record<string, number>;
  originalUrl: string;
  hash: string;
  createdAt: Date;
  lastHitAt: Date | null;
}

interface UrlStatistics {
  totalHits: number;
  sources?: Record<string, number>;
  originalUrl: string;
  hash: string;
  createdAt: Date;
  lastHitAt: Date | null;
}

@Service()
export class UrlShortenerService {
  constructor(private db: Database) {
    console.log("UrlShortenerService initialized");
  }

  async encodeUrl(url: string): Promise<UrlEntity> {
    if (!this.isValidUrl(url)) {
      throw new Error("invalid url");
    }

    const uniqueValue = `${url}-${this.generateRandomId()}}`;

    const urlHash = crypto
      .createHash("sha256")
      .update(uniqueValue)
      .digest("hex")
      .substring(0, 6);
    const shortURLData: UrlEntity = {
      hash: urlHash,
      originalUrl: this.formatUrl(url),
      sources: {},
      createdAt: new Date(),
      lastHitAt: null,
    };
    await this.db.set(urlHash, shortURLData);
    return shortURLData;
  }

  async decodeUrl(shortUrl: string): Promise<string> {
    const hash = shortUrl.split("/").pop();

    if (!hash) throw new Error("invalid url");

    const data = await this.db.get<UrlEntity>(hash);

    if (!data) {
      throw new Error("url not found");
    }
    return data.originalUrl;
  }

  async getUrlStatistics(hash: string): Promise<UrlStatistics> {
    const data = await this.db.get<UrlEntity>(hash);
    if (!data) {
      throw new Error("url not found");
    }
    const totalHits = Object.values(
      data.sources as Record<string, number>
    ).reduce((a: number, b: number) => a + b, 0);

    return {
      totalHits,
      ...(data.sources && { sources: data.sources }),
      originalUrl: data.originalUrl,
      hash: data.hash,
      createdAt: data.createdAt,
      lastHitAt: data.lastHitAt,
    };
  }

  async hitUrl(hash: string, source: string = "unknown") {
    const data = await this.db.get<UrlEntity>(hash);
    if (!data) {
      throw new Error("url not found");
    }
    const sources = data.sources;
    if (!sources[source]) {
      sources[source] = 1;
    } else {
      sources[source] += 1;
    }
    await this.db.update(hash, {
      sources,
      lastHitAt: new Date(),
    });
    return data.originalUrl;
  }

  isValidUrl(url: string) {
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return urlRegex.test(url);
  }

  generateRandomId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 8);
    return timestamp + randomString;
  }

  formatUrl(url: string) {
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    url = url.toLowerCase();
    return url;
  }
}
