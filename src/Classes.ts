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
  Friday: string;
  InstructionMode: string;
  Instructor: string;
  Monday: string;
  Room: number;
  Saturday: string;
  Section: number;
  StartDate: string;
  StartTime: string;
  Subject: string;
  Sunday: string;
  Thursday: string;
  Tuesday: string;
  Units: number;
  Wednesday: string;
}

export interface SectionsData {
  name: String;
  sections: Array<Section>;
}

export interface Schedule extends Array<Section> {}
