import { Database } from "../database/database";
import * as crypto from "crypto";

export class UrlShortnerService {
  constructor(private db: Database) {}

  async encodeUrl(url: string): Promise<string> {
    const shortUrl = "testUrl";
    await this.db.set(shortUrl, { url });
    return shortUrl;
  }
}
