import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Base Dino</title>
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
