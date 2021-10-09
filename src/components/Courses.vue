<template>
  <div id="coursesContainer">
    <CourseQuery @find-sections="findSections" />
    <CourseSelect :courses="courses" @switch-selected="switchSelected" />
    <input type="button" value="Find Schedules" @click="findSchedules" />
  </div>
</template>

<script lang="ts">
import { Section, SectionsData } from "@/Classes";
import { defineComponent } from "vue";
import CourseQuery from "./CourseQuery.vue";
import CourseSelect from "./CourseSelect.vue";

export default defineComponent({
  name: "Courses",
  data() {
    return {
      courses: [
        {
          name: "CS 2400",
          sections: [
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 35,
              ClassNumber: 33058,
              ClassTitle: "Data Structures and Advanced Programming",
              Component: "Lecture",
              CourseNumber: 2400,
              EndDate: "2022-05-13",
              EndTime: "11:50:00",
              Friday: "True",
              InstructionMode: "Face-to-Face",
              Instructor: "Ji, Hao",
              Monday: "True",
              Room: 52,
              Saturday: "False",
              Section: 1,
              StartDate: "2022-01-22",
              StartTime: "10:45:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "False",
              Tuesday: "False",
              Units: 4,
              Wednesday: "True",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 53,
              ClassNumber: 33060,
              ClassTitle: "Data Structures and Advanced Programming",
              Component: "Lecture",
              CourseNumber: 2400,
              EndDate: "2022-05-13",
              EndTime: "11:50:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Dong, Qichao",
              Monday: "False",
              Room: 4,
              Saturday: "False",
              Section: 3,
              StartDate: "2022-01-22",
              StartTime: "10:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "True",
              Tuesday: "True",
              Units: 4,
              Wednesday: "False",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 53,
              ClassNumber: 33061,
              ClassTitle: "Data Structures and Advanced Programming",
              Component: "Lecture",
              CourseNumber: 2400,
              EndDate: "2022-05-13",
              EndTime: "16:50:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Dong, Qichao",
              Monday: "False",
              Room: 4,
              Saturday: "False",
              Section: 4,
              StartDate: "2022-01-22",
              StartTime: "15:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "True",
              Tuesday: "True",
              Units: 4,
              Wednesday: "False",
              Selected: true,
            },
          ],
        },
        {
          name: "CS 2450",
          sections: [
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 35,
              ClassNumber: 33066,
              ClassTitle: "User Interface Design and Programming",
              Component: "Lecture",
              CourseNumber: 2450,
              EndDate: "2022-05-13",
              EndTime: "15:45:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Steichen, Ben",
              Monday: "True",
              Room: 348,
              Saturday: "False",
              Section: 1,
              StartDate: "2022-01-22",
              StartTime: "14:30:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "False",
              Tuesday: "False",
              Units: 3,
              Wednesday: "True",
              Selected: true,
            },
          ],
        },
        {
          name: "CS 2600",
          sections: [
            {
              AcademicSession: "Regular Academic Session",
              Building: null,
              ClassCapacity: 35,
              ClassNumber: 33069,
              ClassTitle: "Systems Programming",
              Component: "Lecture",
              CourseNumber: 2600,
              EndDate: "2022-05-13",
              EndTime: "18:45:00",
              Friday: "False",
              InstructionMode: "Fully Synchronous",
              Instructor: "Davarpanah, Nima",
              Monday: "True",
              Room: null,
              Saturday: "False",
              Section: 1,
              StartDate: "2022-01-22",
              StartTime: "17:30:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "False",
              Tuesday: "False",
              Units: 3,
              Wednesday: "True",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 3,
              ClassCapacity: 35,
              ClassNumber: 33070,
              ClassTitle: "Systems Programming",
              Component: "Lecture",
              CourseNumber: 2600,
              EndDate: "2022-05-13",
              EndTime: "20:15:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Atanasio, Dominick",
              Monday: "True",
              Room: 2636,
              Saturday: "False",
              Section: 2,
              StartDate: "2022-01-22",
              StartTime: "19:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "False",
              Tuesday: "False",
              Units: 3,
              Wednesday: "True",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 35,
              ClassNumber: 33071,
              ClassTitle: "Systems Programming",
              Component: "Lecture",
              CourseNumber: 2600,
              EndDate: "2022-05-13",
              EndTime: "20:15:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Atanasio, Dominick",
              Monday: "False",
              Room: 345,
              Saturday: "False",
              Section: 3,
              StartDate: "2022-01-22",
              StartTime: "19:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "True",
              Tuesday: "True",
              Units: 3,
              Wednesday: "False",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: null,
              ClassCapacity: 35,
              ClassNumber: 33072,
              ClassTitle: "Systems Programming",
              Component: "Lecture",
              CourseNumber: 2600,
              EndDate: "2022-05-13",
              EndTime: "18:45:00",
              Friday: "False",
              InstructionMode: "Fully Synchronous",
              Instructor: "Gershman, David",
              Monday: "False",
              Room: null,
              Saturday: "False",
              Section: 4,
              StartDate: "2022-01-22",
              StartTime: "17:30:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "True",
              Tuesday: "True",
              Units: 3,
              Wednesday: "False",
              Selected: true,
            },
          ],
        },
        {
          name: "CS 2640",
          sections: [
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 34,
              ClassNumber: 33074,
              ClassTitle: "Computer Organization and Assembly Programming",
              Component: "Lecture",
              CourseNumber: 2640,
              EndDate: "2022-05-13",
              EndTime: "09:50:00",
              Friday: "True",
              InstructionMode: "Face-to-Face",
              Instructor: "Nguyen, Thanh",
              Monday: "True",
              Room: 348,
              Saturday: "False",
              Section: 1,
              StartDate: "2022-01-22",
              StartTime: "09:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "False",
              Tuesday: "False",
              Units: 3,
              Wednesday: "True",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 34,
              ClassNumber: 33075,
              ClassTitle: "Computer Organization and Assembly Programming",
              Component: "Lecture",
              CourseNumber: 2640,
              EndDate: "2022-05-13",
              EndTime: "10:50:00",
              Friday: "True",
              InstructionMode: "Face-to-Face",
              Instructor: "Amamra, Abdelfattah",
              Monday: "True",
              Room: 348,
              Saturday: "False",
              Section: 2,
              StartDate: "2022-01-22",
              StartTime: "10:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "False",
              Tuesday: "False",
              Units: 3,
              Wednesday: "True",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 3,
              ClassCapacity: 35,
              ClassNumber: 33076,
              ClassTitle: "Computer Organization and Assembly Programming",
              Component: "Lecture",
              CourseNumber: 2640,
              EndDate: "2022-05-13",
              EndTime: "14:15:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Nguyen, Thanh",
              Monday: "False",
              Room: 2636,
              Saturday: "False",
              Section: 3,
              StartDate: "2022-01-22",
              StartTime: "13:00:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "True",
              Tuesday: "True",
              Units: 3,
              Wednesday: "False",
              Selected: true,
            },
            {
              AcademicSession: "Regular Academic Session",
              Building: 8,
              ClassCapacity: 35,
              ClassNumber: 33077,
              ClassTitle: "Computer Organization and Assembly Programming",
              Component: "Lecture",
              CourseNumber: 2640,
              EndDate: "2022-05-13",
              EndTime: "15:45:00",
              Friday: "False",
              InstructionMode: "Face-to-Face",
              Instructor: "Johannsen, David",
              Monday: "False",
              Room: 345,
              Saturday: "False",
              Section: 4,
              StartDate: "2022-01-22",
              StartTime: "14:30:00",
              Subject: "CS",
              Sunday: "False",
              Thursday: "True",
              Tuesday: "True",
              Units: 3,
              Wednesday: "False",
              Selected: true,
            },
          ],
        },
      ] as SectionsData[],
    };
  },
  components: {
    CourseQuery,
    CourseSelect,
  },
  methods: {
    async findSections(subject: string, number: string) {
      subject = subject.toUpperCase();
      number = number.toUpperCase();
      let query = `http://127.0.0.1:8000/api/courses/Sp22/?Subject=${subject}&CourseNumber=${number}`.replace(" ", "+");
      let response = await fetch(query);
      let sections: Array<Section> = await response.json();
      console.log(this.courses);
      if (sections.length == 0) {
        // Add "No sections found error here"
      } else if (this.courses.find((sectionsData) => sectionsData.name == `${subject} ${number}`)) {
        // Add "Course already added error"
      } else if (this.courses.length >= 8) {
        // Add "Too many courses already added error"
      } else {
        sections.forEach((section) => (section.Selected = true));
        let sectionsData: SectionsData = {
          name: `${subject} ${number}`,
          sections: sections,
        };
        this.courses.push(sectionsData);
        console.log("Changed courses");
      }
    },
    switchSelected(sectionNumber: number, className: string) {
      this.courses = this.courses.map((sectionsData) => {
        if (sectionsData.name == className) {
          sectionsData.sections = sectionsData.sections.map((section: Section) => {
            if (section.Section == sectionNumber) {
              section.AcademicSession = "changed";
              section.Selected = !section.Selected;
            }
            return section;
          });
        }
        return sectionsData;
      }) as SectionsData[];
    },
    findSchedules() {
      let courses = this.courses.slice();
      let filteredCourses: SectionsData[] = courses.map((sectionsData) => {
        return {
          name: sectionsData.name as String,
          sections: sectionsData.sections.filter((section: Section) => {
            return section.Selected == true;
          }),
        };
      });
      filteredCourses.forEach((sectionsData) => {
        if (sectionsData.sections.length == 0) {
          // No sections selected for sectionsData.name error
          return;
        }
      });
      this.$emit("find-schedules", filteredCourses);
    },
  },
  emits: ["find-schedules"],
});
</script>

<style scoped>
#coursesContainer {
  flex-grow: 1;
  width: 100%;
}
</style>
