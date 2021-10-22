<template>
  <div id="coursesContainer">
    <h1 id="pageTitle">CPP Scheduler</h1>

    <h3 class="name">Add Courses</h3>
    <CourseQuery @find-course="findCourse" />
    <input type="button" value="Clear Courses" @click="clearCourses" class="button" />

    <h3 class="name" v-if="notEmpty">Select Sections</h3>
    <CourseSelect v-if="notEmpty" />

    <!-- <h3 class="name">Add Breaks</h3> -->
  </div>
</template>

<script lang="ts">
import { Section, Course } from "@/Classes";
import { defineComponent } from "vue";
import CourseQuery from "./CourseQuery.vue";
import CourseSelect from "./CourseSelect.vue";

export default defineComponent({
  name: "Courses",
  components: {
    CourseQuery,
    CourseSelect,
  },
  computed: {
    notEmpty() {
      return this.$store.state.courses.length > 0;
    },
  },
  methods: {
    async findCourse(subject: string, number: string) {
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
      } else if (this.$store.state.courses.find((sectionsData) => sectionsData.name == `${subject} ${number}`)) {
        this.error(`Course already added: ${subject}${number}`);
      } else if (this.$store.state.courses.length >= 12) {
        this.error(`Cannot add course. Maximum reached`);
      } else {
        sections.forEach((section) => (section.Selected = true));
        sections.sort((a, b) => {
          return a.Section - b.Section;
        });
        let course: Course = {
          name: `${subject} ${number}`,
          sections: sections,
        };
        this.$store.dispatch("addCourse", course);
      }
    },
    error(error: String) {
      alert(error);
    },
    clearCourses() {
      this.$store.commit("clearCourses");
    },
  },
  emits: ["find-schedules"],
});
</script>

<style scoped>
.name {
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
@media (min-width: 961px) {
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
