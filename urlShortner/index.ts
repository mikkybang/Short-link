import { Container } from "typedi";
import { Express } from "express";
import { UrlShortnerService } from "./urlShortner.service";
import UrlShortnerController from "./urlShortner.controller";

export default function initModule(app: Express) {
  const urlShortnerService = Container.get(UrlShortnerService);
  new UrlShortnerController(urlShortnerService, app);
  return;
}
