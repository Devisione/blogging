import type { NextPage } from "next";
import type { ReactNode } from "react";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: JSX.Element) => ReactNode;
};
