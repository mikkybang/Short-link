import { Request, Response, Express } from "express";
import { Inject, Service } from "typedi";
import "reflect-metadata";

import { UrlShortnerService } from "./urlShortner.service";

@Service()
export default class UrlShortnerController {
  constructor(
    @Inject(() => UrlShortnerService)
    private urlShortnerService: UrlShortnerService,
    private app: Express
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log("Initializing routes");
    this.app.post("/encode", this.encodeUrl.bind(this));
    this.app.post("/decode", this.decodeUrl.bind(this));
  }

  public async encodeUrl(req: Request, res: Response) {
    try {
      const { url } = req.body;
      if (!url) throw new Error("Url not provided");
      const result = await this.urlShortnerService.encodeUrl(url);
      res
        .send({
          message: "Url encoded successfully",
          data: result,
        })
        .status(201);
      return;
    } catch (error: any) {
      return res.status(400).send({
        message: error.message || "Error while encoding url",
        data: error,
      });
    }
  }

  public async decodeUrl(req: Request, res: Response) {
    try {
      const { shortUrl } = req.params;
      const result = await this.urlShortnerService.decodeUrl(shortUrl);

      return {
        message: "Url decoded successfully",
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error while decoding url");
    }
  }
}
