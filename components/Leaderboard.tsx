import { useEffect, useState } from "react";
import styles from "../styles/DinoGame.module.css";

type Entry = {
  address: string;
  score: number;
};

type LeaderboardProps = {
  refreshKey?: number;
};

export default function Leaderboard({ refreshKey }: LeaderboardProps) {
  const [entries, setEntries] = useState<Entry[]>([]);

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
      <h3>Топ 5</h3>
      {entries.length === 0 ? (
        <p>Поки що немає результатів</p>
      ) : (
        <ol>
          {entries.map((entry) => (
            <li key={entry.address}>
              <span>{entry.address.slice(0, 6)}...</span>
              <strong>{entry.score}</strong>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
