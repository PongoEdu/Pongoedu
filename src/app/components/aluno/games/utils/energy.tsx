import type { StudentProgress } from "./game.types";

const ENERGY_REFILL_MINUTES = 30;

export function refillEnergy(progress: StudentProgress): StudentProgress {
  const now = Date.now();
  const elapsedMs = now - progress.lastEnergyRefill;
  const refillIntervalMs = ENERGY_REFILL_MINUTES * 60 * 1000;

  const recovered = Math.floor(elapsedMs / refillIntervalMs);

  if (recovered <= 0) return progress;

  if (progress.energy >= progress.maxEnergy) {
    return {
      ...progress,
      lastEnergyRefill: now,
    };
  }

  const nextEnergy = Math.min(progress.maxEnergy, progress.energy + recovered);
  const consumedMs = recovered * refillIntervalMs;

  return {
    ...progress,
    energy: nextEnergy,
    lastEnergyRefill: progress.lastEnergyRefill + consumedMs,
  };
}

export function getTimeUntilNextEnergy(progress: StudentProgress): number | null {
  if (progress.energy >= progress.maxEnergy) return null;

  const refillIntervalMs = ENERGY_REFILL_MINUTES * 60 * 1000;
  const now = Date.now();
  const elapsedMs = now - progress.lastEnergyRefill;
  const remainingMs = refillIntervalMs - (elapsedMs % refillIntervalMs);

  return remainingMs;
}

export function canPlay(progress: StudentProgress): boolean {
  return progress.energy > 0;
}

export function consumeEnergy(progress: StudentProgress): StudentProgress {
  if (progress.energy <= 0) return progress;

  return {
    ...progress,
    energy: progress.energy - 1,
  };
}