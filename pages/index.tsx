import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="base:app_id" content="696e9eb7c0ab25addaaaf693" />
        <title>Base Games — Dino & Морський бій</title>
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "next",
            imageUrl: "https://base-dino.vercel.app/og.png",
            button: {
              title: "Play Now",
              action: {
                type: "launch_miniapp",
                name: "Base Games",
                url: "https://base-dino.vercel.app",
                splashImageUrl: "https://base-dino.vercel.app/splash.png",
                splashBackgroundColor: "#0b1120",
              },
            },
          })}
        />
        <meta
          name="description"
          content="Base Dino та Морський бій — дві гри в Base App."
        />
      </Head>
      <main className="page">
        <div className="cards">
          <section className="card">
            <h1 className="title">Base Dino</h1>
            <p className="subtitle">
              Міні-гра в стилі офлайн-динозавра з Chrome.
            </p>
            <Link className="primaryLink" href="/game">
              Грати
            </Link>
            <div className="tips">
              <span>Space / ↑ — стрибок</span>
              <span>R — рестарт</span>
              <span>Тап — стрибок</span>
            </div>
          </section>
          <section className="card">
            <h1 className="title">Морський бій</h1>
            <p className="subtitle">
              Класична гра проти компʼютера.
            </p>
            <Link className="primaryLink" href="/battleship">
              Грати
            </Link>
            <div className="tips">
              <span>Клік — постріл по ворожому полю</span>
              <span>Твоя сітка зліва</span>
              <span>Ворожа сітка справа</span>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
