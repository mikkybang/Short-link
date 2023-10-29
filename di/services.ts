import db from "../database/inMemoryDatabase";
import { UrlShortnerService } from "../urlShortner/urlShortner.service";

export const services = {
  [UrlShortnerService.name]: new UrlShortnerService(db),
};
