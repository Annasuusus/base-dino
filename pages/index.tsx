import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Base Dino</title>
        <meta name="base:app_id" content="696e9eb7c0ab25addaaaf693" />
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://base-dino.vercel.app/og.png",
            button: {
              title: "Play Now",
              action: {
                type: "launch_miniapp",
                name: "Base Dino",
                url: "https://base-dino.vercel.app",
                splashImageUrl: "https://base-dino.vercel.app/splash.png",
                splashBackgroundColor: "#0b1120",
              },
            },
          })}
        />
        <meta
          name="description"
          content="Мини-игра: перепрыгивай препятствия и набирай очки."
        />
      </Head>
      <main className="page">
        <section className="card">
          <h1 className="title">Base Dino</h1>
          <p className="subtitle">
            Мини-игра в стиле офлайн-динозавра из Chrome.
          </p>
          <Link className="primaryLink" href="/game">
            Играть
          </Link>
          <div className="tips">
            <span>Space / ↑ — прыжок</span>
            <span>R — рестарт</span>
            <span>Тап — прыжок</span>
          </div>
        </section>
      </main>
    </>
  );
}
