// export interface Block {
//   EndTime: string;
//   Friday: string;
//   Monday: string;
//   Saturday: string;
//   StartTime: string;
//   Sunday: string;
//   Thursday: string;
//   Tuesday: string;
//   Wednesday: string;
// }

// export interface Section extends Block {
//   Selected: boolean;
//   AcademicSession: string;
//   Building: number;
//   ClassCapacity: number;
//   ClassNumber: number;
//   ClassTitle: string;
//   Component: string;
//   CourseNumber: number;
//   EndDate: string;
//   EndTime: string;
//   InstructionMode: string;
//   Instructor: string;
//   Room: number;
//   Section: number;
//   StartDate: string;
//   StartTime: string;
//   Subject: string;
//   Units: number;
// }

// export interface Course {
//   name: string;
//   sections: Array<Section>;
// }

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

// export interface SaveData {
//   courses: {
//     subject: string;
//     courseNumber: string;
//   }[];
//   activeSections: number[];
//   breaks: Block[];
// }

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

export interface Section {
  ClassCapacity: number;
  ClassNumber: number;
  ClassTitle: string;
  Component: string;
  CourseNumber: string;
  EndDate: string;
  EndTime: string;
  Friday: boolean;
  InstructionMode: string;
  InstructorFirst: string;
  InstructorLast: string;
  Location: string;
  Monday: boolean;
  Saturday: boolean;
  Section: string;
  StartDate: string;
  StartTime: string;
  Subject: string;
  Sunday: boolean;
  Term: string;
  Thursday: boolean;
  Tuesday: boolean;
  TotalEnrollment: number;
  Units: number;
  Wednesday: boolean;
  A: number;
  "A-": number;
  "B+": number;
  B: number;
  "B-": number;
  "C+": number;
  C: number;
  "C-": number;
  "D+": number;
  D: number;
  "D-": number;
  F: number;
}

export const enum QueryType {
  byCourse,
}

// stores the info of the query (this info is saved)
export interface Query {
  expanded: boolean;
  type: QueryType;
  minGPA: number;
  course?: Course;
}

// the results of a query
export interface QueryResult {
  sections: Array<Section>;
  query: Query;
}

export interface Course {
  Subject: string;
  CourseNumber: string;
  AvgGPA: number;
  label: string;
}

export interface CourseList extends Array<Course> {}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  courseIndex: number;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  section: Section;
}
