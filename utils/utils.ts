import { Section } from "../types/models";
import { Break } from "types/types";

export function getCourse(section: Section) {
  return section.Subject + " " + section.CourseNumber;
}

export function getProfessor(section: Section) {
  return section.InstructorFirst + " " + section.InstructorLast;
}

export function round(num: number) {
  return Math.round(num * 1000) / 1000;
}

export function getDays(section: Section | Break) {
  let res: string = "";
  if (section.Sunday) res += "Su";
  if (section.Monday) res += "M";
  if (section.Tuesday) res += "Tu";
  if (section.Wednesday) res += "W";
  if (section.Thursday) res += "Th";
  if (section.Friday) res += "F";
  if (section.Saturday) res += "S";
  if (res === "") return "TBA";
  return res;
}

export let defaultKeywords = ["cpp", "schedule", "opencpp", "cppscheduler"];
