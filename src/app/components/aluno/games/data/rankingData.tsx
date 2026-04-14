import type { StudentProgress } from "./game.types";

export const rankingMock: StudentProgress[] = [
  {
    studentId: "1",
    studentName: "Ana",
    classroomId: "turma-3a",
    completedLevelIds: ["quimica-1", "quimica-2"],
    streak: 8,
    xp: 1500,
    energy: 4,
    maxEnergy: 5,
    lastEnergyRefill: Date.now(),
  },
  {
    studentId: "2",
    studentName: "Carlos",
    classroomId: "turma-3a",
    completedLevelIds: ["quimica-1"],
    streak: 6,
    xp: 1320,
    energy: 3,
    maxEnergy: 5,
    lastEnergyRefill: Date.now(),
  },
  {
    studentId: "3",
    studentName: "Você",
    classroomId: "turma-3a",
    completedLevelIds: [],
    streak: 4,
    xp: 1240,
    energy: 5,
    maxEnergy: 5,
    lastEnergyRefill: Date.now(),
  },
];