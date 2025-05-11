import Document, { Head, Html, Main, NextScript } from "next/document";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

class MyDocument extends Document {
  render() {
    return (
      <Html {...mantineHtmlProps}>
        <Head>
          <meta
            content="width=device-width, initial-scale=1.0"
            name="viewport"
          />
          <ColorSchemeScript />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
