import { Trophy } from "lucide-react";
import type { StudentProgress } from "../types/game.types";

interface EnergyCardProps {
  energy: number;
  maxEnergy: number;
  countdownLabel: string;
}

export function EnergyCard({
  energy,
  maxEnergy,
  countdownLabel,
}: EnergyCardProps) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-red-500" />
        <h2 className="text-xl">Energia</h2>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: maxEnergy }).map((_, index) => (
          <Heart
            key={index}
            className={`w-6 h-6 ${
              index < energy
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground/40"
            }`}
          />
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm">
          Disponível:{" "}
          <span className="font-medium">
            {energy}/{maxEnergy}
          </span>
        </p>

        <p className="text-xs text-muted-foreground">
          {countdownLabel}
        </p>
      </div>
    </div>
  );
}