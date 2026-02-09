type ScoreEntry = {
  address: string;
  score: number;
  updatedAt: string;
};

const scores = new Map<string, ScoreEntry>();

export function submitScore(address: string, score: number) {
  const existing = scores.get(address);
  if (!existing || score > existing.score) {
    const entry: ScoreEntry = {
      address,
      score,
      updatedAt: new Date().toISOString(),
    };
    scores.set(address, entry);
    return entry;
  }
  return existing;
}

export function getLeaderboard(limit = 5) {
  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getUserBest(address: string) {
  return scores.get(address)?.score ?? null;
}
