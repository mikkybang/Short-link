import DIContainer, { object } from "rsdi";

import { services } from "./services";

export default function configureDI() {
  const container = new DIContainer();

  return container;
}

configureDI();
