import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const rootUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://mygame-iota-one.vercel.app";

  return (
    <>
      <Head>
        <meta name="base:app_id" content="696e9eb7c0ab25addaaaf693" key="base-app-id" />
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: `${rootUrl}/og.png`,
            button: {
              title: "Грати",
              action: {
                type: "launch_miniapp",
                name: "Морський бій",
                url: rootUrl,
                splashImageUrl: `${rootUrl}/splash.png`,
                splashBackgroundColor: "#0b1120",
              },
            },
          })}
        />
        <meta property="og:title" content="Морський бій" />
        <meta property="og:description" content="Класична гра Морський бій проти комп'ютера." />
        <meta property="og:image" content={`${rootUrl}/og.png`} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
