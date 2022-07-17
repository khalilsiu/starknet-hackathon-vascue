import {
  Controller as RoutingController,
  JsonController,
} from "routing-controllers";
import { Service } from "typedi";

export const Controller =
  (...args: Parameters<typeof RoutingController>) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  <TFunction extends Function>(target: TFunction): void => {
    Service()(target);
    JsonController(...args)(target);
  };
