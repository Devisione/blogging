import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import type { NextPageWithLayout } from "@features/Layout/model/types";
import { EffectorNext } from "@effector/next";
import Layout from "@features/Layout/ui";
import { DatesProvider } from "@mantine/dates";
import { RouterInitialize } from "@services/Router/model";
// eslint-disable-next-line import/no-extraneous-dependencies -- зависимость от @mantine/dates
import "dayjs/locale/ru";

const App = ({
  Component,
  pageProps,
}: AppProps<{ values: any }> & { Component: NextPageWithLayout }) => {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <EffectorNext values={pageProps.values}>
      <RouterInitialize />

      <MantineProvider>
        <DatesProvider settings={{ locale: "ru" }}>
          {getLayout(<Component {...pageProps} />)}
        </DatesProvider>
      </MantineProvider>
    </EffectorNext>
  );
};

export default App;
