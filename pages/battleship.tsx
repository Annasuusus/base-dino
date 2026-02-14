import dynamic from "next/dynamic";
import Head from "next/head";

const BattleshipGame = dynamic(() => import("../components/BattleshipGame"), {
  ssr: false,
});

export default function BattleshipPage() {
  return (
    <>
      <Head>
        <title>Морський бій — Base</title>
      </Head>
      <main className="page">
        <BattleshipGame />
      </main>
    </>
  );
}
