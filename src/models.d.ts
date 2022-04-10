export type Section = {
  id: number;
  ClassCapacity: number | null;
  ClassNumber: number | null;
  ClassTitle: string | null;
  Component: string | null;
  CourseNumber: string;
  EndDate: string | null;
  EndTime: string | null;
  Friday: boolean | null;
  InstructionMode: string | null;
  InstructorFirst: string | null;
  InstructorLast: string | null;
  Location: string | null;
  Monday: boolean | null;
  Saturday: boolean | null;
  Section: string;
  StartDate: string | null;
  StartTime: string | null;
  Subject: string;
  Sunday: boolean | null;
  Term: string | null;
  Thursday: boolean | null;
  Tuesday: boolean | null;
  TotalEnrollment: number | null;
  Units: number | null;
  Wednesday: boolean | null;
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
  instructionId: number | null;
  instructions: Instruction;
};

export type Instruction = {
  id: number;
  Subject: string;
  CourseNumber: string;
  InstructorFirst: string | null;
  InstructorLast: string | null;
  TotalEnrollment: number | null;
  AvgGPA: number | null;
  courseId: number | null;
  instructorId: number | null;
};

export type Instructor = {
  id: number;
  InstructorFirst: string | null;
  InstructorLast: string | null;
  TotalEnrollment: number | null;
  AvgGPA: number | null;
  Label: string | null;
};

export type Course = {
  id: number;
  Subject: string | null;
  CourseNumber: string | null;
  TotalEnrollment: number | null;
  AvgGPA: number | null;
  Label: string | null;
};
