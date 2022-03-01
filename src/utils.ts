import { GPA, Section } from "./app/Classes";

export function getCourse(section: Section) {
  return section.Subject + " " + section.CourseNumber;
}

export function getProfessor(section: Section) {
  return section.InstructorFirst + " " + section.InstructorLast;
}

export function calcAvg(sections: Section[]) {
  let tEnrollment = 0;
  let tPoints = 0;
  for (let section of sections) {
    if (!section.TotalEnrollment) continue;
    tEnrollment += section.TotalEnrollment;
    for (let grade of Object.keys(GPA)) {
      // @ts-ignore
      let studentCount: any = section[grade];
      tPoints += GPA[grade] * studentCount;
    }
  }
  return Math.round((tPoints / tEnrollment) * 1000) / 1000;
}
