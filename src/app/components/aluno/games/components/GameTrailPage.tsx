import { useEffect, useMemo, useState } from "react";
import {
  Lock,
  CheckCircle2,
  PlayCircle,
  Trophy,
  Star,
  Flame,
} from "lucide-react";
import type { GameTrack, StudentProgress } from "../types/game.types";
import { rankingMock } from "../data/rankingData";
import {
  refillEnergy,
  consumeEnergy,
  canPlay,
  getTimeUntilNextEnergy,
} from "../utils/energy";
import { getClassroomRanking, getStudentPosition } from "../utils/ranking";
import { RankingCard } from "./RankingCard";
import { EnergyCard } from "./EnergyCard";

interface GameTrailPageProps {
  track: GameTrack;
}

const CURRENT_STUDENT_ID = "3";

function getStorageKey(slug: string) {
  return `pongoedu-track-${slug}-student-${CURRENT_STUDENT_ID}`;
}

function getInitialProgress(): StudentProgress {
  return {
    studentId: "3",
    studentName: "Você",
    classroomId: "turma-3a",
    completedLevelIds: [],
    streak: 4,
    xp: 1240,
    energy: 5,
    maxEnergy: 5,
    lastEnergyRefill: Date.now(),
  };
}

export function GameTrailPage({ track }: GameTrailPageProps) {
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem(getStorageKey(track.slug));
    if (!saved) return getInitialProgress();

    try {
      return JSON.parse(saved) as StudentProgress;
    } catch {
      return getInitialProgress();
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => refillEnergy(prev));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(getStorageKey(track.slug), JSON.stringify(progress));
  }, [progress, track.slug]);

  const refreshedProgress = useMemo(() => refillEnergy(progress), [progress]);

  const completedSet = useMemo(
    () => new Set(refreshedProgress.completedLevelIds),
    [refreshedProgress.completedLevelIds]
  );

  const nextUnlockedIndex = track.levels.findIndex(
    (level) => !completedSet.has(level.id)
  );

  const currentIndex =
    nextUnlockedIndex === -1 ? track.levels.length - 1 : nextUnlockedIndex;

  const isCompleted = (levelId: string) => completedSet.has(levelId);

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return completedSet.has(track.levels[index - 1].id);
  };

  const completeLevel = (index: number) => {
    const level = track.levels[index];
    const current = refillEnergy(progress);

    if (!isUnlocked(index) || isCompleted(level.id)) return;
    if (!canPlay(current)) return;

    const next = consumeEnergy({
      ...current,
      completedLevelIds: [...current.completedLevelIds, level.id],
      streak: current.streak + 1,
      xp: current.xp + level.xp,
    });

    setProgress(next);
  };

  const completedCount = refreshedProgress.completedLevelIds.length;
  const progressPercent =
    track.levels.length > 0
      ? Math.round((completedCount / track.levels.length) * 100)
      : 0;

  const rankingData = useMemo(() => {
    const hasCurrentStudent = rankingMock.some(
      (student) => student.studentId === refreshedProgress.studentId
    );

    const merged = hasCurrentStudent
      ? rankingMock.map((student) =>
          student.studentId === refreshedProgress.studentId
            ? refreshedProgress
            : student
        )
      : [...rankingMock, refreshedProgress];

    return getClassroomRanking(merged, refreshedProgress.classroomId);
  }, [refreshedProgress]);

  const studentPosition = getStudentPosition(
    rankingData,
    refreshedProgress.classroomId,
    refreshedProgress.studentId
  );

  const nextEnergyMs = getTimeUntilNextEnergy(refreshedProgress);

  const energyCountdown =
    nextEnergyMs === null
      ? "Energia cheia"
      : `Próxima energia em ${Math.floor(nextEnergyMs / 60000)} min`;

  return (
    <div className="p-6">
      <div
        className={`mb-8 rounded-3xl border-2 border-border bg-gradient-to-br ${track.accent} p-6`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl mb-2">{track.title}</h1>
            <p className="text-muted-foreground">
              Complete um nível por vez para liberar o próximo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-background/70 p-4 border border-border min-w-24">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Ofensiva</span>
              </div>
              <div className="text-2xl">{refreshedProgress.streak}</div>
            </div>

            <div className="rounded-2xl bg-background/70 p-4 border border-border min-w-24">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">XP</span>
              </div>
              <div className="text-2xl">{refreshedProgress.xp}</div>
            </div>

            <div className="rounded-2xl bg-background/70 p-4 border border-border min-w-24">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-sm">Ranking</span>
              </div>
              <div className="text-2xl">
                {studentPosition > 0 ? `#${studentPosition}` : "-"}
              </div>
            </div>

            <div className="rounded-2xl bg-background/70 p-4 border border-border min-w-24">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">Energia</span>
              </div>
              <div className="text-2xl">
                {refreshedProgress.energy}/{refreshedProgress.maxEnergy}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {energyCountdown}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border-2 border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl">Mapa da Trilha</h2>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{track.levels.length} concluídos
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-accent overflow-hidden mb-6">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-col gap-5">
            {track.levels.map((level, index) => {
              const completed = isCompleted(level.id);
              const unlocked = isUnlocked(index);
              const active = index === currentIndex && !completed;

              return (
                <div
                  key={level.id}
                  className={`rounded-2xl border-2 p-5 transition-all ${
                    completed
                      ? "border-green-300 bg-green-50/60"
                      : active
                      ? "border-primary bg-primary/5"
                      : unlocked
                      ? "border-border bg-card"
                      : "border-border bg-muted/40 opacity-80"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-green-100 text-green-600"
                            : active
                            ? "bg-primary/15 text-primary"
                            : unlocked
                            ? "bg-secondary/15 text-secondary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : unlocked ? (
                          <PlayCircle className="w-7 h-7" />
                        ) : (
                          <Lock className="w-7 h-7" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg">{level.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {level.description}
                        </p>
                        <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs">
                          +{level.xp} XP
                        </span>
                      </div>
                    </div>

                    <div>
                      {completed ? (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-green-100 text-green-700 cursor-default"
                        >
                          Concluído
                        </button>
                      ) : unlocked ? (
                        <button
                          onClick={() => completeLevel(index)}
                          disabled={!canPlay(refreshedProgress)}
                          className={`px-4 py-2 rounded-xl transition-colors ${
                            canPlay(refreshedProgress)
                              ? active
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "bg-secondary hover:bg-secondary/90 text-white"
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          {canPlay(refreshedProgress)
                            ? active
                              ? "Jogar agora"
                              : "Revisar nível"
                            : "Sem energia"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-muted text-muted-foreground cursor-not-allowed"
                        >
                          Bloqueado
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <EnergyCard
            energy={refreshedProgress.energy}
            maxEnergy={refreshedProgress.maxEnergy}
            countdownLabel={energyCountdown}
          />

          <RankingCard
            ranking={rankingData}
            currentStudentId={refreshedProgress.studentId}
          />
        </div>
      </div>
    </div>
  );
}