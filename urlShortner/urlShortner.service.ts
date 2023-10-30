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

    const urlHash = crypto
      .createHash("sha256")
      .update(url)
      .digest("hex")
      .substring(0, 6);
    const shortURLData: UrlEntity = {
      hash: urlHash,
      originalUrl: url,
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
}
