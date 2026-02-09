import { useEffect, useRef, useState } from "react";
import styles from "../styles/DinoGame.module.css";
import WalletConnect from "./WalletConnect";
import Leaderboard from "./Leaderboard";

type Obstacle = {
  x: number;
  width: number;
  height: number;
};

type GameState = {
  dinoY: number;
  dinoVY: number;
  speed: number;
  distance: number;
  nextObstacleIn: number;
  obstacles: Obstacle[];
  started: boolean;
  gameOver: boolean;
};

const GAME_WIDTH = 800;
const GAME_HEIGHT = 240;
const GROUND_Y = 190;
const DINO_WIDTH = 56;
const DINO_HEIGHT = 64;
const GRAVITY = 2200;
const JUMP_VELOCITY = 720;

const initialState = (): GameState => ({
  dinoY: 0,
  dinoVY: 0,
  speed: 280,
  distance: 0,
  nextObstacleIn: 260,
  obstacles: [],
  started: false,
  gameOver: false,
});

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(initialState());
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const bestScoreRef = useRef(0);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = Number(localStorage.getItem("base-dino-best") || "0");
      if (!Number.isNaN(stored)) {
        bestScoreRef.current = stored;
        setBestScore(stored);
      }
    }
  }, []);

  useEffect(() => {
    if (!address) return;
    const loadBest = async () => {
      const res = await fetch("/api/score/me");
      const data = (await res.json()) as { best: number | null };
      if (typeof data.best === "number") {
        bestScoreRef.current = data.best;
        setBestScore(data.best);
      }
    };
    loadBest();
  }, [address]);

  useEffect(() => {
    if (!gameOver || !address) return;
    if (submittedScore === score) return;
    const submit = async () => {
      try {
        const res = await fetch("/api/score/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score }),
        });
        const data = (await res.json()) as { best?: number };
        if (typeof data.best === "number") {
          bestScoreRef.current = data.best;
          setBestScore(data.best);
        }
        setSubmittedScore(score);
        setLeaderboardKey((prev) => prev + 1);
      } catch {
        setSubmittedScore(score);
      }
    };
    submit();
  }, [gameOver, address, score, submittedScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * scale;
    canvas.height = GAME_HEIGHT * scale;
    canvas.style.width = `${GAME_WIDTH}px`;
    canvas.style.height = `${GAME_HEIGHT}px`;
    ctx.scale(scale, scale);

    const updateScore = (nextScore: number) => {
      if (nextScore !== scoreRef.current) {
        scoreRef.current = nextScore;
        setScore(nextScore);
        if (!address && nextScore > bestScoreRef.current) {
          bestScoreRef.current = nextScore;
          setBestScore(nextScore);
          if (typeof window !== "undefined") {
            localStorage.setItem("base-dino-best", String(nextScore));
          }
        }
      }
    };

    const draw = (state: GameState, time: number) => {
      const t = time / 1000;
      const moving = state.started && !state.gameOver;
      const bob = moving ? Math.sin(t * 8) * 2.5 : Math.sin(t * 2) * 1.5;
      const flap = moving ? Math.sin(t * 10) * 0.4 : Math.sin(t * 3) * 0.15;
      const blink = Math.sin(t * 1.4) > 0.98;

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 10);
      ctx.lineTo(GAME_WIDTH, GROUND_Y + 10);
      ctx.stroke();

      const dinoX = 60;
      const dinoY = GROUND_Y - DINO_HEIGHT - state.dinoY + bob;

      const drawPenguin = (x: number, y: number) => {
        const bodyW = DINO_WIDTH;
        const bodyH = DINO_HEIGHT;
        const centerX = x + bodyW / 2;
        const centerY = y + bodyH / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1, moving ? 1.02 : 1);
        ctx.translate(-centerX, -centerY);

        const wingW = bodyW * 0.36;
        const wingH = bodyH * 0.55;
        const wingY = y + bodyH * 0.4;
        const wingXLeft = x - wingW * 0.25;
        const wingXRight = x + bodyW - wingW * 0.75;
        ctx.fillStyle = "#0b1220";

        ctx.save();
        ctx.translate(wingXLeft + wingW / 2, wingY + wingH / 2);
        ctx.rotate(-0.6 + flap);
        ctx.beginPath();
        ctx.ellipse(0, 0, wingW / 2, wingH / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(wingXRight + wingW / 2, wingY + wingH / 2);
        ctx.rotate(0.6 - flap);
        ctx.beginPath();
        ctx.ellipse(0, 0, wingW / 2, wingH / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY + 4,
          bodyW / 2,
          bodyH / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY + 8,
          bodyW / 3,
          bodyH / 2.6,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          y + 10,
          bodyW / 3,
          bodyH / 3.2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.moveTo(centerX + 4, y + 18);
        ctx.lineTo(centerX + 14, y + 22);
        ctx.lineTo(centerX + 4, y + 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#0f172a";
        if (blink) {
          ctx.fillRect(centerX - 6, y + 14, 6, 2);
          ctx.fillRect(centerX + 2, y + 14, 6, 2);
        } else {
          ctx.beginPath();
          ctx.arc(centerX - 4, y + 14, 2.2, 0, Math.PI * 2);
          ctx.arc(centerX + 6, y + 14, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "#38bdf8";
        const footOffset = moving ? Math.sin(t * 8) * 2 : 0;
        ctx.fillRect(x + 6, y + bodyH - 6 + footOffset, 14, 5);
        ctx.fillRect(x + bodyW - 20, y + bodyH - 6 - footOffset, 14, 5);

        ctx.restore();
      };

      drawPenguin(dinoX, dinoY);

      ctx.fillStyle = "#f97316";
      state.obstacles.forEach((obstacle) => {
        const top = GROUND_Y - obstacle.height;
        ctx.fillRect(obstacle.x, top, obstacle.width, obstacle.height);
      });

      if (!state.started) {
        ctx.fillStyle = "rgba(248, 250, 252, 0.8)";
        ctx.font = "16px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Нажми Space/↑ или тап для старта", GAME_WIDTH / 2, 80);
      }
    };

    const step = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(0.033, (time - lastTimeRef.current) / 1000);
      lastTimeRef.current = time;

      const state = stateRef.current;
      if (state.started && !state.gameOver) {
        state.speed = Math.min(620, state.speed + dt * 8);
        state.distance += state.speed * dt;

        state.dinoVY -= GRAVITY * dt;
        state.dinoY += state.dinoVY * dt;
        if (state.dinoY < 0) {
          state.dinoY = 0;
          state.dinoVY = 0;
        }

        state.nextObstacleIn -= state.speed * dt;
        if (state.nextObstacleIn <= 0) {
          const height = 28 + Math.random() * 40;
          const width = 18 + Math.random() * 18;
          state.obstacles.push({
            x: GAME_WIDTH + 20,
            width,
            height,
          });
          state.nextObstacleIn = 220 + Math.random() * 260;
        }

        state.obstacles.forEach((obstacle) => {
          obstacle.x -= state.speed * dt;
        });
        state.obstacles = state.obstacles.filter(
          (obstacle) => obstacle.x + obstacle.width > -10
        );

        const dinoX = 60;
        const dinoY = GROUND_Y - DINO_HEIGHT - state.dinoY;
        const dinoRect = {
          x: dinoX,
          y: dinoY,
          width: DINO_WIDTH,
          height: DINO_HEIGHT,
        };

        for (const obstacle of state.obstacles) {
          const obRect = {
            x: obstacle.x,
            y: GROUND_Y - obstacle.height,
            width: obstacle.width,
            height: obstacle.height,
          };
          const hit =
            dinoRect.x < obRect.x + obRect.width &&
            dinoRect.x + dinoRect.width > obRect.x &&
            dinoRect.y < obRect.y + obRect.height &&
            dinoRect.y + dinoRect.height > obRect.y;
          if (hit) {
            state.gameOver = true;
            setGameOver(true);
            break;
          }
        }

        updateScore(Math.floor(state.distance / 10));
      }

      draw(state, time);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [address]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyR") {
        resetGame();
        return;
      }
      if (event.code === "Space" || event.code === "ArrowUp") {
        jump();
      }
    };

    const onPointer = () => {
      jump();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const resetGame = () => {
    stateRef.current = initialState();
    lastTimeRef.current = null;
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setSubmittedScore(null);
  };

  const jump = () => {
    const state = stateRef.current;
    if (state.gameOver) {
      resetGame();
    }
    if (!state.started) {
      state.started = true;
      setStarted(true);
    }
    if (state.dinoY === 0) {
      state.dinoVY = JUMP_VELOCITY;
    }
  };

  return (
    <section className={styles.game}>
      <header className={styles.hud}>
        <div>
          <span className={styles.label}>Счёт</span>
          <span className={styles.value}>{score}</span>
        </div>
        <div>
          <span className={styles.label}>Рекорд</span>
          <span className={styles.value}>{bestScore}</span>
        </div>
        <WalletConnect onAuthChange={setAddress} />
      </header>
      <div className={styles.canvasWrap}>
        <canvas ref={canvasRef} aria-label="Dino game canvas" />
        {gameOver && (
          <div className={styles.overlay}>
            <div className={styles.overlayCard}>
              <h2>Игра окончена</h2>
              <p>Нажми R или тапни, чтобы начать заново</p>
              <button className={styles.restart} onClick={resetGame}>
                Рестарт
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className={styles.footer}>
        {!started && <span>Нажми Space/↑ или тап для старта</span>}
        {started && !gameOver && <span>Space/↑/тап — прыжок</span>}
        {gameOver && <span>R — рестарт</span>}
      </footer>
      <Leaderboard refreshKey={leaderboardKey} />
    </section>
  );
}
