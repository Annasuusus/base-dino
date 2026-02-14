import { useEffect, useState } from "react";
import styles from "../styles/BattleshipGame.module.css";

type Entry = {
  address: string;
  score: number;
};

type Props = { refreshKey?: number };

export default function BattleshipLeaderboard({ refreshKey }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const formatLabel = (address: string) => {
    if (address.startsWith("guest:")) return "Гість";
    return `${address.slice(0, 6)}...`;
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/score/leaderboard");
      const data = (await res.json()) as { leaderboard: Entry[] };
      setEntries(data.leaderboard ?? []);
    };
    load();
  }, [refreshKey]);

  return (
    <div className={styles.leaderboard}>
      <h3>Топ 5 перемог</h3>
      {entries.length === 0 ? (
        <p>Поки немає результатів</p>
      ) : (
        <ol>
          {entries.map((entry) => (
            <li key={entry.address}>
              <span>{formatLabel(entry.address)}</span>
              <strong>{entry.score}</strong>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
