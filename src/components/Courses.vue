<template>
  <div id="coursesContainer">
    <h1 id="pageTitle">CPP Scheduler</h1>

    <h2 id="name">Add Courses</h2>
    <CourseQuery @find-sections="findSections" />
    <input type="button" value="Clear Courses" @click="clearCourses" class="button" />

    <h3 id="name" v-if="notEmpty">Select Sections</h3>
    <CourseSelect
      v-if="notEmpty"
      :courses="courses"
      @find-schedules="findSchedules"
      @switch-selected="switchSelected"
      @delete-course="deleteCourse"
    />
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
      courses: [] as SectionsData[],
    };
  },
  computed: {
    notEmpty() {
      return this.courses.length != 0;
    },
  },
  components: {
    CourseQuery,
    CourseSelect,
  },
  methods: {
    async findSections(subject: string, number: string) {
      subject = subject.toUpperCase();
      number = number.toUpperCase();
      let query = `https://cpp-scheduler.herokuapp.com/api/courses/Sp22/?Subject=${subject}&CourseNumber=${number}`.replace(
        " ",
        "+"
      );
      let response = await fetch(query);
      let sections: Array<Section> = await response.json();
      if (sections.length == 0) {
        this.error(`No sections found under: ${subject}${number}`);
      } else if (this.courses.find((sectionsData) => sectionsData.name == `${subject} ${number}`)) {
        this.error(`Course already added: ${subject}${number}`);
      } else if (this.courses.length >= 12) {
        this.error(`Cannot add course. Maximum reached`);
      } else {
        sections.forEach((section) => (section.Selected = true));
        let sectionsData: SectionsData = {
          name: `${subject} ${number}`,
          sections: sections,
        };
        this.courses.push(sectionsData);
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
    error(str: string) {
      this.$emit("error", str);
    },
    clearCourses() {
      this.courses = [];
    },
    deleteCourse(sectionName: string) {
      this.courses = this.courses.filter((course) => {
        return course.name != sectionName;
      });
    },
  },
  emits: ["find-schedules", "error"],
});
</script>

<style scoped>
#name {
  border-top: 1px black solid;
  text-align: center;
  font-size: 2em;
  margin-top: 0.3em;
  padding-top: 0.7em;
}
#coursesContainer {
  box-sizing: border-box;
  margin: 0;
  padding: 1em;
  border: solid black 1px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
@media (min-width: 641px) {
  #coursesContainer {
    border: 0;
    border-right: solid black 1px;
    width: 25%;
    height: 100vh;
    overflow-y: scroll;
  }
}
#pageTitle {
  font-size: 4em;
  text-align: center;
}
.button {
  align-self: center;
  margin-top: 10px;
}
</style>
