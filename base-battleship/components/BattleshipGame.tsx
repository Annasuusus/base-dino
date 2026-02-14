import { useEffect, useCallback, useState } from "react";
import styles from "../styles/BattleshipGame.module.css";
import WalletConnect from "./WalletConnect";
import BattleshipLeaderboard from "./BattleshipLeaderboard";

const GRID_SIZE = 10;
const SHIP_SIZES = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

type CellState = "water" | "ship" | "hit" | "miss" | "sunk";

type Ship = {
  cells: { row: number; col: number }[];
  hits: number;
};

type GamePhase = "setup" | "playerTurn" | "enemyTurn" | "won" | "lost";

function createEmptyGrid(): CellState[][] {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill("water" as CellState));
}

function placeShips(): { grid: CellState[][]; ships: Ship[] } {
  const grid = createEmptyGrid();
  const ships: Ship[] = [];

  for (const size of SHIP_SIZES) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      const cells: { row: number; col: number }[] = [];
      let valid = true;
      for (let i = 0; i < size; i++) {
        const r = horizontal ? row : row + i;
        const c = horizontal ? col + i : col;
        if (r >= GRID_SIZE || c >= GRID_SIZE) {
          valid = false;
          break;
        }
        if (grid[r][c] !== "water") valid = false;
        cells.push({ row: r, col: c });
      }

      if (valid) {
        cells.forEach(({ row: r, col: c }) => (grid[r][c] = "ship"));
        ships.push({ cells, hits: 0 });
        placed = true;
      }
    }
  }

  return { grid, ships };
}

function getShipAt(
  ships: Ship[],
  row: number,
  col: number
): Ship | undefined {
  return ships.find((s) =>
    s.cells.some((c) => c.row === row && c.col === col)
  );
}

export default function BattleshipGame() {
  const [playerGrid, setPlayerGrid] = useState<CellState[][]>(() =>
    createEmptyGrid()
  );
  const [enemyGrid, setEnemyGrid] = useState<CellState[][]>(() =>
    createEmptyGrid()
  );
  const [playerShips, setPlayerShips] = useState<Ship[]>([]);
  const [enemyShips, setEnemyShips] = useState<Ship[]>([]);
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [lastEnemyShot, setLastEnemyShot] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [wins, setWins] = useState(0);
  const [bestWins, setBestWins] = useState(0);
  const [address, setAddress] = useState<string | null>(null);
  const [submittedWins, setSubmittedWins] = useState<number | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  const startGame = useCallback(() => {
    const player = placeShips();
    const enemy = placeShips();
    setPlayerGrid(player.grid);
    setEnemyGrid(enemy.grid);
    setPlayerShips(player.ships);
    setEnemyShips(enemy.ships);
    setPhase("playerTurn");
    setLastEnemyShot(null);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = Number(
        localStorage.getItem("base-battleship-best") || "0"
      );
      if (!Number.isNaN(stored)) setBestWins(stored);
    }
  }, []);

  useEffect(() => {
    if (!address) return;
    const loadBest = async () => {
      const res = await fetch("/api/score/me");
      const data = (await res.json()) as { best: number | null };
      if (typeof data.best === "number") setBestWins(data.best);
    };
    loadBest();
  }, [address]);

  useEffect(() => {
    if (phase !== "won" || !address) return;
    if (submittedWins === wins) return;
    const submit = async () => {
      try {
        const res = await fetch("/api/score/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: wins }),
        });
        const data = (await res.json()) as { best?: number };
        if (typeof data.best === "number") setBestWins(data.best);
        setSubmittedWins(wins);
        setLeaderboardKey((k) => k + 1);
      } catch {
        setSubmittedWins(wins);
      }
    };
    submit();
  }, [phase, address, wins, submittedWins]);

  const handlePlayerShoot = useCallback(
    (row: number, col: number) => {
      if (phase !== "playerTurn") return;
      if (enemyGrid[row][col] !== "water" && enemyGrid[row][col] !== "ship")
        return;

      const ship = getShipAt(enemyShips, row, col);
      const newEnemyGrid = enemyGrid.map((r, ri) =>
        r.map((c, ci) => {
          if (ri !== row || ci !== col) return c;
          return ship ? "hit" : "miss";
        })
      );

      if (ship) {
        const newHits = ship.hits + 1;
        const isSunk = newHits >= ship.cells.length;
        if (isSunk) {
          ship.cells.forEach(({ row: r, col: c }) => {
            newEnemyGrid[r][c] = "sunk";
          });
        }
        const updatedShips = enemyShips.map((s) =>
          s === ship ? { ...s, hits: newHits } : s
        );
        setEnemyShips(updatedShips);
        const allSunk = updatedShips.every(
          (s) => s.hits >= s.cells.length
        );
        if (allSunk) {
          setEnemyGrid(newEnemyGrid);
          setPhase("won");
          setWins((w) => {
            const next = w + 1;
            if (!address) {
              const stored = Number(
                localStorage.getItem("base-battleship-best") || "0"
              );
              if (next > stored) {
                localStorage.setItem("base-battleship-best", String(next));
                setBestWins(next);
              }
            }
            return next;
          });
          return;
        }
      }

      setEnemyGrid(newEnemyGrid);
      setPhase("enemyTurn");
      setLastEnemyShot(null);

      setTimeout(() => {
        let enemyRow: number, enemyCol: number;
        do {
          enemyRow = Math.floor(Math.random() * GRID_SIZE);
          enemyCol = Math.floor(Math.random() * GRID_SIZE);
        } while (
          playerGrid[enemyRow][enemyCol] === "hit" ||
          playerGrid[enemyRow][enemyCol] === "miss" ||
          playerGrid[enemyRow][enemyCol] === "sunk"
        );

        const playerShip = getShipAt(playerShips, enemyRow, enemyCol);
        const newPlayerGrid = playerGrid.map((r, ri) =>
          r.map((c, ci) => {
            if (ri !== enemyRow || ci !== enemyCol) return c;
            return playerShip ? "hit" : "miss";
          })
        );

        if (playerShip) {
          const newHits = playerShip.hits + 1;
          const isSunk = newHits >= playerShip.cells.length;
          if (isSunk) {
            playerShip.cells.forEach(({ row: r, col: c }) => {
              newPlayerGrid[r][c] = "sunk";
            });
          }
          const updatedShips = playerShips.map((s) =>
            s === playerShip ? { ...s, hits: newHits } : s
          );
          setPlayerShips(updatedShips);
          const allSunk = updatedShips.every(
            (s) => s.hits >= s.cells.length
          );
          if (allSunk) {
            setPlayerGrid(newPlayerGrid);
            setPhase("lost");
            setLastEnemyShot({ row: enemyRow, col: enemyCol });
            return;
          }
        }

        setPlayerGrid(newPlayerGrid);
        setLastEnemyShot({ row: enemyRow, col: enemyCol });
        setPhase("playerTurn");
      }, 400);
    },
    [
      phase,
      enemyGrid,
      enemyShips,
      playerGrid,
      playerShips,
      address,
    ]
  );

  const showEnemyShip = phase === "won";

  return (
    <section className={styles.game}>
      <header className={styles.hud}>
        <div>
          <span className={styles.label}>Перемоги</span>
          <span className={styles.value}>{wins}</span>
        </div>
        <div>
          <span className={styles.label}>Рекорд</span>
          <span className={styles.value}>{bestWins}</span>
        </div>
        <WalletConnect onAuthChange={setAddress} />
      </header>

      <div className={styles.boards}>
        <div className={styles.boardWrap}>
          <h3 className={styles.boardTitle}>Твій флот</h3>
          <div className={styles.grid}>
            {playerGrid.map((row, ri) =>
              row.map((col, ci) => (
                <div
                  key={`p-${ri}-${ci}`}
                  className={`${styles.cell} ${styles[col]} ${
                    lastEnemyShot?.row === ri && lastEnemyShot?.col === ci
                      ? styles.lastShot
                      : ""
                  }`}
                  aria-label={`Твоя клітина ${ri + 1}-${ci + 1}`}
                />
              ))
            )}
          </div>
        </div>

        <div className={styles.boardWrap}>
          <h3 className={styles.boardTitle}>Ворожий флот — клікай тут!</h3>
          <div className={styles.grid}>
            {enemyGrid.map((row, ri) =>
              row.map((col, ci) => {
                const displayState =
                  !showEnemyShip && col === "ship" ? "water" : col;
                const clickable =
                  phase === "playerTurn" &&
                  (col === "water" || col === "ship");
                return (
                  <div
                    key={`e-${ri}-${ci}`}
                    role="button"
                    tabIndex={clickable ? 0 : -1}
                    className={`${styles.cell} ${styles[displayState]} ${
                      clickable ? styles.clickable : ""
                    }`}
                    onClick={
                      clickable
                        ? (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePlayerShoot(ri, ci);
                          }
                        : undefined
                    }
                    onKeyDown={
                      clickable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handlePlayerShoot(ri, ci);
                            }
                          }
                        : undefined
                    }
                    aria-label={`Ворожа клітина ${ri + 1}-${ci + 1}`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className={styles.status}>
        {phase === "setup" && <span>Підготовка...</span>}
        {phase === "playerTurn" && (
          <span>Твій хід — обери клітину ворожого поля</span>
        )}
        {phase === "enemyTurn" && <span>Хід противника...</span>}
        {phase === "won" && (
          <>
            <span className={styles.won}>Перемога!</span>
            <button className={styles.restart} onClick={startGame}>
              Наступна партія
            </button>
          </>
        )}
        {phase === "lost" && (
          <>
            <span className={styles.lost}>Поразка</span>
            <button className={styles.restart} onClick={startGame}>
              Реванш
            </button>
          </>
        )}
      </div>

      <BattleshipLeaderboard refreshKey={leaderboardKey} />
    </section>
  );
}
