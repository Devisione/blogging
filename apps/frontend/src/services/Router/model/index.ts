import { memo, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import type { ParsedUrlQuery } from "node:querystring";
import { attach, createEvent, createStore, sample } from "effector";
import { createGate, useGate, useUnit } from "effector-react";

export const RouterGate = createGate<{ router: NextRouter | null }>();
const $router = createStore<NextRouter | null>(null, {
  serialize: "ignore",
})
  .on(RouterGate.open, (_, { router }) => router)
  .reset(RouterGate.close);

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
  const { onChangePage, onInitPage } = useUnit({
    onChangePage: onChangePageEv,
    onInitPage: onInitPageEv,
  });

  useGate(RouterGate, { router });

  useEffect(() => {
    onInitPage();
  }, [onInitPage]);

  useEffect(() => {
    onChangePage(router.pathname);
  }, [onChangePage, router.pathname]);
  return null;
});

RouterInitialize.displayName = "RouterInitialize";
