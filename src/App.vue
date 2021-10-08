<template>
  <div id="container">
    <h1 id="title">CPP Scheduler</h1>
    <Courses @find-schedules="findSchedules" />
    <Schedule />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SectionsData } from "./Classes";
import Courses from "./components/Courses.vue";
import Schedule from "./components/Schedule.vue";

export default defineComponent({
  name: "App",
  components: {
    Courses,
    Schedule,
  },
  data() {
    return {
      schedules: Schedule[]
    }
  },
  methods: {
    findSchedules(sectionsData: SectionsData[]):void {

    },
    getHours(str: string): number {
      return parseInt(str.substring(0, 2));
    },
    getMinutes(str: string): number {
      return parseInt(str.substring(3, 5));
    },
  },
});
</script>

<style></style>
