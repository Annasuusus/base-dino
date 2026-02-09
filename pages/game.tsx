import dynamic from "next/dynamic";
import Head from "next/head";

const DinoGame = dynamic(() => import("../components/DinoGame"), {
  ssr: false,
});

export default function GamePage() {
  return (
    <>
      <Head>
        <title>Base Dino — Игра</title>
      </Head>
      <main className="page">
        <DinoGame />
      </main>
    </>
  );
}
