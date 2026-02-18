import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "../styles/globals.css";

const BASE_APP_ID = "696e9eb7c0ab25addaaaf693";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const ready = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
      } catch {
        // Ignore if SDK not available
      }
    };
    ready();
  }, []);

  return (
    <>
      <Head>
        <meta name="base:app_id" content={BASE_APP_ID} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
