import { Service } from "typedi";
import "reflect-metadata";
import * as crypto from "crypto";

import { Database } from "../database/database";

interface UrlEntity {
  originalUrl: string;
  hash: string;
  sources: Record<string, number>;
  createdAt: Date;
  lastHitAt: Date;
}

@Service()
export class UrlShortnerService {
  constructor(private db: Database) {
    console.log("UrlShortnerService initialized");
  }

  async encodeUrl(url: string): Promise<string> {
    const urlHash = "testUrl";
    

    await this.db.set(urlHash, { url });
    return urlHash;
  }

  async decodeUrl(shortUrl: string): Promise<string> {
    const data = await this.db.get(shortUrl);
    return data.url;
  }
}
