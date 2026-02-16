import Head from "next/head";
import Link from "next/link";

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
            imageUrl: "https://mygame-iota-one.vercel.app/og.png",
            button: {
              title: "Грати",
              action: {
                type: "launch_miniapp",
                name: "Морський бій",
                url: "https://mygame-iota-one.vercel.app",
                splashImageUrl: "https://mygame-iota-one.vercel.app/splash.png",
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
        <section className="card" style={{ maxWidth: 400, margin: "2rem auto" }}>
          <h1 className="title">Морський бій</h1>
          <p className="subtitle">Класична гра проти комп'ютера.</p>
          <Link className="primaryLink" href="/game">
            Грати
          </Link>
        </section>
      </main>
    </>
  );
}
