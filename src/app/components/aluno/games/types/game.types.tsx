export interface GameLevel {
  id: string;
  title: string;
  description: string;
  xp: number;
}

export interface GameTrack {
  slug: string;
  title: string;
  accent: string;
  levels: GameLevel[];
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  classroomId: string;
  completedLevelIds: string[];
  streak: number;
  xp: number;
  energy: number;
  maxEnergy: number;
  lastEnergyRefill: number;
}