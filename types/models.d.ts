export type Section = {
  id: number;
  ClassCapacity: number;
  ClassNumber: number;
  Component: string | null;
  CourseNumber: string;
  EndTime: string | null;
  Friday: boolean | null;
  InstructionMode: string;
  InstructorFirst: string;
  InstructorLast: string;
  Location: string | null;
  Monday: boolean | null;
  Saturday: boolean | null;
  Section: string;
  StartTime: string | null;
  Subject: string;
  Sunday: boolean | null;
  Term: string;
  Thursday: boolean | null;
  Tuesday: boolean | null;
  Units: number | null;
  Wednesday: boolean | null;
  TotalEnrollment: number;
  A: number | null;
  Am: number | null;
  Bp: number | null;
  B: number | null;
  Bm: number | null;
  Cp: number | null;
  C: number | null;
  Cm: number | null;
  Dp: number | null;
  D: number | null;
  Dm: number | null;
  F: number | null;
  AvgGPA: number | null;
  instructionId: number;
  Graded: boolean;

  instructions: Instruction;

  // local properties
  selected: boolean;
  expanded: boolean;
};

export type Instruction = {
  id: number;
  Subject: string;
  CourseNumber: string;
  InstructorFirst: string;
  InstructorLast: string;
  TotalEnrollment: number;
  AvgGPA: number | null;
  courseId: number;
  instructorId: number;
};

export type Instructor = {
  id: number;
  InstructorFirst: string;
  InstructorLast: string;
  TotalEnrollment: number;
  AvgGPA: number | null;
  Label: string;
};

export type Course = {
  id: number;
  Subject: string;
  CourseNumber: string;
  TotalEnrollment: number;
  AvgGPA: number | null;
  Label: string;
  CourseTitle: string | null;
};
