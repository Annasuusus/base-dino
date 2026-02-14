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
