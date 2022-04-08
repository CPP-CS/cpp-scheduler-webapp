import { Section } from "models";

export function getCourse(section: Section) {
  return section.Subject + " " + section.CourseNumber;
}

export function getProfessor(section: Section) {
  return section.InstructorFirst + " " + section.InstructorLast;
}

export function round(num: number) {
  return Math.round(num * 1000) / 1000;
}
