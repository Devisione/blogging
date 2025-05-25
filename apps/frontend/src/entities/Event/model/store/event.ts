import { createQuery } from "@farfetched/core";
import { $router, onChangePageEv } from "@services/Router/model";
import { sample } from "effector";
import { EventApi } from "../../api";

export const $event = createQuery({
  handler: (id: string) => {
    return EventApi.getEventById({ id });
  },
});

sample({
  source: $router,
  clock: onChangePageEv,
  fn: (router, _pathname) => {
    return router?.query.eventId as string;
  },
  filter: (router, pathname) => {
    return pathname.includes("/publication") && Boolean(router?.query.eventId);
  },
  target: $event.start,
});
