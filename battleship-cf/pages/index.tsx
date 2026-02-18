import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="base:app_id" content="696e9eb7c0ab25addaaaf693" />
        <title>Морський бій — Base</title>
        <meta name="description" content="Класична гра Морський бій проти комп'ютера." />
      </Head>
      <main className="page">
        <section className="card">
          <h1 className="title">Морський бій</h1>
          <p className="subtitle">Класична гра проти комп'ютера.</p>
          <Link className="primaryLink" href="/game/">
            Грати
          </Link>
        </section>
      </main>
    </>
  );
}
