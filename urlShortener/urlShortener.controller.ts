import { Request, Response, Express } from "express";
import { Inject, Service } from "typedi";
import "reflect-metadata";

import { UrlShortenerService } from "./urlShortener.service";

@Service()
export default class UrlShortenerController {
  constructor(
    @Inject(() => UrlShortenerService)
    private urlShortenerService: UrlShortenerService,
    private app: Express
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log("Initializing routes");
    this.app.post("/encode", this.encodeUrl.bind(this));
    this.app.post("/decode", this.decodeUrl.bind(this));
    this.app.get("/statistic/:url", this.getUrlStatistics.bind(this));
    this.app.get("/:hash", this.hitUrl.bind(this));
  }

  public async encodeUrl(req: Request, res: Response) {
    try {
      const { url } = req?.body;
      if (!url) throw new Error("Url not provided");
      const result = await this.urlShortenerService.encodeUrl(url);
      res.status(201).json({
        message: "Url encoded successfully",
        data: result,
      });

      return;
    } catch (error: any) {
      console.log(error);
      return res.status(400).send({
        message: error.message || "Error while encoding url",
        data: error,
      });
    }
  }

  public async decodeUrl(req: Request, res: Response) {
    try {
      const { url } = req.body;
      const result = await this.urlShortenerService.decodeUrl(url);
      return res.status(200).json({
        message: "Url decoded successfully",
        data: result,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).send({
        message: error.message || "Error while decoding url",
        data: error,
      });
    }
  }

  public async getUrlStatistics(req: Request, res: Response) {
    try {
      const { url } = req.params;
      const result = await this.urlShortenerService.getUrlStatistics(url);
      return res.status(200).json({
        message: "Url Statistics",
        data: result,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(400).send({
        message: error.message || "Error while retriving url statistics",
        data: error,
      });
    }
  }

  public async hitUrl(req: Request, res: Response) {
    try {
      const { hash } = req.params;
      const { src } = req.query;
      const source = src ? src.toString().toLowerCase() : "unknown";
      const result = await this.urlShortenerService.hitUrl(hash, source);
      return res.redirect(result);
    } catch (error: any) {
      console.log(error);
      return res.status(404).send({
        message: error.message || "Error while hitting url",
        data: error,
      });
    }
  }
}
