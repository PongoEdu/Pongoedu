import type { StudentProgress } from "./game.types";

export function getClassroomRanking(
  allStudents: StudentProgress[],
  classroomId: string
): StudentProgress[] {
  return allStudents
    .filter((student) => student.classroomId === classroomId)
    .sort((a, b) => b.xp - a.xp);
}

export function getStudentPosition(
  allStudents: StudentProgress[],
  classroomId: string,
  studentId: string
): number {
  const ranking = getClassroomRanking(allStudents, classroomId);
  return ranking.findIndex((student) => student.studentId === studentId) + 1;
}