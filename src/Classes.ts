export interface Block {
  EndTime: string;
  Friday: string;
  Monday: string;
  Saturday: string;
  StartTime: string;
  Sunday: string;
  Thursday: string;
  Tuesday: string;
  Wednesday: string;
}

export interface Section extends Block {
  Selected: boolean;
  AcademicSession: string;
  Building: number;
  ClassCapacity: number;
  ClassNumber: number;
  ClassTitle: string;
  Component: string;
  CourseNumber: number;
  EndDate: string;
  EndTime: string;
  InstructionMode: string;
  Instructor: string;
  Room: number;
  Section: number;
  StartDate: string;
  StartTime: string;
  Subject: string;
  Units: number;
}

export interface Course {
  name: string;
  sections: Array<Section>;
}

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

export enum GPA {
  "A" = 4.0,
  "A-" = 3.7,
  "B+" = 3.3,
  "B" = 3.0,
  "B-" = 2.7,
  "C+" = 2.3,
  "C" = 2.0,
  "C-" = 1.7,
  "D+" = 1.3,
  "D" = 1.0,
  "D-" = 0.7,
  "F" = 0,
}

export interface SaveData {
  courses: {
    subject: string;
    courseNumber: string;
  }[];
  activeSections: number[];
  breaks: Block[];
}
