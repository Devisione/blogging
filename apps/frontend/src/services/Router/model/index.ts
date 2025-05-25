import { memo, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import type { ParsedUrlQuery } from "node:querystring";
import { attach, createEvent, createStore, sample } from "effector";
import { useUnit } from "effector-react";

const updateRouterEv = createEvent<NextRouter>();
const $router = createStore<NextRouter | null>(null).on(
  updateRouterEv,
  (_, router) => {
    return router;
  },
);

const $query = createStore<ParsedUrlQuery | undefined | null>(null);

sample({
  clock: $router,
  fn: (router) => router?.query,
  target: $query,
});

const pushFx = attach({
  source: $router,
  effect: (router, url: string) => router?.push(url),
});

const replaceFx = attach({
  source: $router,
  effect: (router, url: string) => router?.replace(url),
});

const onChangePageEv = createEvent<string>();
const onInitPageEv = createEvent();

const pushQueryFx = attach({
  source: $router,
  effect: (router, query: ParsedUrlQuery | null) => {
    void router?.push({ query: { ...router.query, ...query } });
  },
});

// Like Public API
export {
  pushFx,
  replaceFx,
  pushQueryFx,
  onInitPageEv,
  onChangePageEv,
  $router,
  $query,
};

export const RouterInitialize = memo(() => {
  const router = useRouter();
  const { onChangePage, onInitPage, updateRouter } = useUnit({
    onChangePage: onChangePageEv,
    onInitPage: onInitPageEv,
    updateRouter: updateRouterEv,
  });

  useEffect(() => {
    if (router.isReady) {
      updateRouter(router);
      onInitPage();
    }
  }, [onInitPage, router, updateRouter]);

  useEffect(() => {
    if (router.isReady) {
      updateRouter(router);
      onChangePage(router.pathname);
    }
  }, [onChangePage, router, router.pathname, updateRouter]);

  return null;
});

RouterInitialize.displayName = "RouterInitialize";
