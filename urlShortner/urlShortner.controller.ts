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
      const { url } = req?.body;
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
      const { url } = req.body;
      const result = await this.urlShortnerService.decodeUrl(url);
      return res
        .send({
          message: "Url decoded successfully",
          data: result,
        })
        .status(200);
    } catch (error: any) {
      console.log(error);
      return res.status(400).send({
        message: error.message || "Error while decoding url",
        data: error,
      });
    }
  }
}
