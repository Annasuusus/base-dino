import { Html, Head, Main, NextScript } from "next/document";

// Base verification — має бути в початковому HTML
const BASE_APP_ID = "696e9eb7c0ab25addaaaf693";

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        <meta name="base:app_id" content={BASE_APP_ID} key="base-app-id" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
