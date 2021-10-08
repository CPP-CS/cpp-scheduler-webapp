<template>
  <div id="container">
    <h1 id="title">CPP Scheduler</h1>
    <Courses @find-schedules="findSchedules" />
    <Schedules :schedules="schedules" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SectionsData, Schedule } from "./Classes";
import Courses from "./components/Courses.vue";
import Schedules from "./components/Schedules.vue";

export default defineComponent({
  name: "App",
  components: {
    Courses,
    Schedules,
  },
  data() {
    return {
      schedules: [] as Schedule[],
    };
  },
  methods: {
    findSchedules(courses: SectionsData[]): void {
      console.log(courses);
      let result: Schedule[] = [];
      for (let section of courses[0].sections) {
        result.push([section]);
      }
      for (let i = 1; i < courses.length; i++) {
        let tempSchedules: Schedule[] = [];
        for (let section of courses[i].sections) {
          for (let schedule of result) {
            let newSchedule: Schedule = [...schedule, section];
            this.sortSchedule(newSchedule);
            if (this.isValidSchedule(newSchedule)) tempSchedules.push(newSchedule);
          }
        }
        result = tempSchedules;
      }
      console.log(result);
      this.schedules = result;
    },
    isValidSchedule(schedule: Schedule) {
      for (let i = 0; i < schedule.length - 1; i++) {
        let first = schedule[i].EndTime;
        let second = schedule[i + 1].StartTime;
        if (first == "TBA" || second == "TBA") continue;
        if (this.getHours(first) == this.getHours(second)) {
          if (this.getMinutes(first) > this.getMinutes(second)) return false;
        }
        if (this.getHours(first) > this.getHours(second)) return false;
      }
      return true;
    },
    sortSchedule(schedule: Schedule) {
      schedule.sort((first, second) => {
        let one = first.StartTime;
        let two = second.StartTime;
        if (one == "TBA") return 1;
        if (two == "TBA") return -1;
        if (this.getHours(one) == this.getHours(two)) return this.getMinutes(one) - this.getMinutes(two);
        return this.getHours(one) - this.getHours(two);
      });
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

<style scoped>
#title {
  font-size: 5em;
  text-align: center;
}
* {
  font-family: "Noto Sans Display", sans;
}
</style>
