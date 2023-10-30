import { Service } from "typedi";
import "reflect-metadata";
import * as crypto from "crypto";

import { Database } from "../database/database";

@Service()
export class UrlShortnerService {
  constructor(private db: Database) {
    console.log("UrlShortnerService initialized");
  }

  async encodeUrl(url: string): Promise<string> {
    const shortUrl = "testUrl";
    await this.db.set(shortUrl, { url });
    return shortUrl;
  }

  async decodeUrl(shortUrl: string): Promise<string> {
    const data = await this.db.get(shortUrl);
    return data.url;
  }
}
