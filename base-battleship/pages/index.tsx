import dynamic from "next/dynamic";
import Head from "next/head";

const BattleshipGame = dynamic(() => import("../components/BattleshipGame"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Морський бій — Base</title>
        <meta name="base:app_id" content="696e9eb7c0ab25addaaaf693" />
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://mygame-iota-one.vercel.app/og.svg",
            button: {
              title: "Грати",
              action: {
                type: "launch_miniapp",
                name: "Морський бій",
                url: "https://mygame-iota-one.vercel.app",
                splashImageUrl: "https://mygame-iota-one.vercel.app/splash.svg",
                splashBackgroundColor: "#0b1120",
              },
            },
          })}
        />
        <meta
          name="description"
          content="Класична гра Морський бій проти комп'ютера."
        />
      </Head>
      <main className="page">
        <BattleshipGame />
      </main>
    </>
  );
}
