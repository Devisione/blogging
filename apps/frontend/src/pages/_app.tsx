import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import type { NextPageWithLayout } from "@features/Layout/model/types";
import { EffectorNext } from "@effector/next";
import Layout from "@features/Layout/ui";
import { RouterInitialize } from "@services/Router/model";

const App = ({
  Component,
  pageProps,
}: AppProps<{ values: any }> & { Component: NextPageWithLayout }) => {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <EffectorNext values={pageProps.values}>
      <RouterInitialize />

      <MantineProvider>
        {getLayout(<Component {...pageProps} />)}
      </MantineProvider>
    </EffectorNext>
  );
};

export default App;
