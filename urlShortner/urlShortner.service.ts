import { Service } from "typedi";
import "reflect-metadata";
import * as crypto from "crypto";

import { Database } from "../database/database";

interface UrlEntity {
  originalUrl: string;
  hash: string;
  sources: Record<string, number>;
  createdAt: Date;
  lastHitAt: Date | null;
}

@Service()
export class UrlShortnerService {
  constructor(private db: Database) {
    console.log("UrlShortnerService initialized");
  }

  async encodeUrl(url: string): Promise<UrlEntity> {
    if (!this.isValidUrl(url)) {
      throw new Error("Invalid url");
    }

    const uniqueValue = `${url}-${this.generateRandomId()}}`;

    console.log(uniqueValue);

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
    await this.db.set(urlHash, { url });
    return shortURLData;
  }

  async decodeUrl(shortUrl: string): Promise<string> {
    const data = await this.db.get<UrlEntity>(shortUrl);
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
