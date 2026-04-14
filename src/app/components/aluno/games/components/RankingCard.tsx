import { Trophy } from "lucide-react";
import type { StudentProgress } from "../types/game.types";

interface Props {
  ranking: StudentProgress[];
  currentStudentId: string;
}

export function RankingCard({ ranking, currentStudentId }: Props) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-5">
      <h2 className="text-lg mb-4">Ranking</h2>

      {ranking.map((student, index) => (
        <div key={student.studentId}>
          {index + 1} - {student.studentName}
        </div>
      ))}
    </div>
  );
}