import { Service } from "typedi";
import { Database } from "../database/database";
import * as crypto from "crypto";


@Service()
export class UrlShortnerService {
  constructor(private db: Database) {}

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
