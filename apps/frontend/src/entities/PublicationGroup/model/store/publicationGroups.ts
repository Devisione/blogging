import { createMutation, createQuery } from "@farfetched/core";
import { $router, onChangePageEv, pushFx } from "@services/Router/model";
import { sample } from "effector";
import { $events } from "../../../Event/model/store";
import { PublicationGroupApi } from "../../api";

export const $publicationGroup = createQuery({
  handler: (id: string) => {
    return PublicationGroupApi.getPublicationGroupById({ groupId: id });
  },
});

sample({
  source: $router,
  clock: onChangePageEv,
  fn: (router, _pathname) => {
    return router?.query.publicationId as string;
  },
  filter: (router, pathname) => {
    return (
      pathname.includes("/publication") && Boolean(router?.query.publicationId)
    );
  },
  target: $publicationGroup.start,
});

export const deletePublicationGroupMutation = createMutation({
  handler: PublicationGroupApi.deletePublicationGroup,
});

sample({
  source: $router,
  clock: deletePublicationGroupMutation.$succeeded,
  filter: (_router, success) => success,
  target: $events.start,
});

export const createPublicationGroupMutation = createQuery({
  handler: PublicationGroupApi.createPublicationGroup,
});

sample({
  source: $router,
  clock: createPublicationGroupMutation.$data,
  filter: (_source, data) => Boolean(data?.id),
  fn: (_router, data) => `/publication/${data?.eventId}/${data?.id}`,
  target: pushFx,
});
