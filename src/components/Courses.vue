<template>
  <div id="coursesContainer">
    <h1 id="pageTitle">CPP Scheduler</h1>

    <h3 class="name">Add Courses</h3>
    <CourseQuery @find-course="findCourse" />
    <input type="button" value="Clear Courses" @click="clearCourses" class="button" />

    <h3 class="name" v-if="coursesNotEmpty">Select Sections</h3>
    <CourseSelect v-if="coursesNotEmpty" />

    <h3 class="name">Add Breaks</h3>
    <BreaksAdd />
    <h3 class="name" v-if="breaksNotEmpty"></h3>
    <BreaksDisplay v-if="breaksNotEmpty" />

    <h3 class="name">Save Progress</h3>
    <SaveProgress />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CourseQuery from "./CourseQuery.vue";
import CourseSelect from "./CourseSelect.vue";
import SaveProgress from "./SaveProgress.vue";
import BreaksAdd from "./BreaksAdd.vue";
import BreaksDisplay from "./BreaksDisplay.vue";

export default defineComponent({
  name: "Courses",
  components: {
    CourseQuery,
    CourseSelect,
    SaveProgress,
    BreaksAdd,
    BreaksDisplay,
  },
  computed: {
    coursesNotEmpty() {
      return this.$store.state.courses.length > 0;
    },
    breaksNotEmpty() {
      return this.$store.state.breaks.length > 0;
    },
  },
  methods: {
    findCourse(subject: string, courseNumber: string) {
      this.$store.dispatch("findCourse", {
        subject: subject,
        courseNumber: courseNumber,
      });
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
