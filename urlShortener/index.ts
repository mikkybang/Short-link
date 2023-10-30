import { Container } from "typedi";
import { Express } from "express";
import { UrlShortenerService } from "./urlShortener.service";
import UrlShortenerController from "./urlShortener.controller";

export default function initModule(app: Express) {
  const urlShortenerService = Container.get(UrlShortenerService);
  new UrlShortenerController(urlShortenerService, app);
  return;
}
