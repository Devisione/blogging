// eslint-disable-next-line no-restricted-imports -- всё ок
import type { Channel } from "@entities/Channel/model/types";

export interface User {
  id: string;
  name: string;
  email: string;
  channels: Channel[];
}
