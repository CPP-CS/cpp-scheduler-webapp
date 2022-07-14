import { Course, Instructor } from "./../types/models.d";
import path from "path";
import { promises as fs } from "fs";

export interface CourseMap {
  [key: string]: Course;
}
export interface InstructorMap {
  [key: string]: Instructor;
}

export const cache = {
  set: async (key: string, value: any) => {
    await fs.writeFile(path.join(process.cwd(), `${key}.db`), JSON.stringify(value));
  },
  get: async (key: string): Promise<any> => {
    const data = await fs.readFile(path.join(process.cwd(), `${key}.db`));
    const item: any = JSON.parse(data as unknown as string);
    return item;
  },
};
