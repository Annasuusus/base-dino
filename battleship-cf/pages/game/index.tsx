import Head from "next/head";
import dynamic from "next/dynamic";

const BattleshipGame = dynamic(() => import("../../components/BattleshipGame"), { ssr: false });

export default function GamePage() {
  return (
    <>
      <Head>
        <title>Морський бій — Гра</title>
      </Head>
      <main className="page">
        <BattleshipGame />
      </main>
    </>
  );
}
