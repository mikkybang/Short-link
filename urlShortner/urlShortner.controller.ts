import { Request, Response } from "express";
import { UrlShortnerService } from "./urlShortner.service";
import { Inject, Service } from "typedi";

@Service()
export default class UrlShortnerController {
  constructor(
    @Inject(() => UrlShortnerService)
    private urlShortnerService: UrlShortnerService
  ) {}

  public async encodeUrl(req: Request, res: Response) {
    try {
      const { url } = req.body;
      const result = await this.urlShortnerService.encodeUrl(url);

      return {
        message: "Url encoded successfully",
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error while encoding url");
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
