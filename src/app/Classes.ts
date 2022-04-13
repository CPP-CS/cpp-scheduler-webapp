import { Course, Section } from "models";

export interface Schedule extends Array<Section> {}

export enum WeekDays {
  "Sunday" = "02",
  "Monday" = "03",
  "Tuesday" = "04",
  "Wednesday" = "05",
  "Thursday" = "06",
  "Friday" = "07",
  "Saturday" = "08",
}

type GPAType = {
  [key: string]: number;
};

export const GPA: GPAType = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0,
};

export interface Break {
  Friday: boolean;
  Monday: boolean;
  Saturday: boolean;
  Sunday: boolean;
  Thursday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;

  StartTime: string;
  EndTime: string;

  name: string;
  selected: boolean;
}

export const enum QueryType {
  byCourse,
}

// stores the info of the query (this info is saved)
export interface Query {
  expanded: boolean;
  type: QueryType;
  minGPA: number;
  allowStaff?: boolean;
  course?: Course;
  sections: Array<Section>;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  courseIndex: number;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  section: Section | Break;
}

export interface CompressedCourse {
  Subject: string;
  CourseNumber: string;
}

export interface CompressedSection {
  selected: boolean;
  Subject: string;
  CourseNumber: string;
  Section: string;
}
export interface CompressedQuery {
  type: QueryType;
  minGPA: number;
  allowStaff: boolean;
  course?: CompressedCourse;
  sections: Array<CompressedSection>;
}

export interface SaveData {
  queryList: Array<CompressedQuery>;
  breakList: Array<Break>;
  currentSchedule: number;
}
