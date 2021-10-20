<template>
  <div id="container">
    <Courses @find-schedules="findSchedules" @error="error" />
    <Schedules :schedules="schedules" :key="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SectionsData, Schedule, WeekDays, Section } from "./Classes";
import Courses from "./components/Courses.vue";
import Schedules from "./components/Schedules.vue";
import { nanoid } from "nanoid";

export default defineComponent({
  name: "App",
  components: {
    Courses,
    Schedules,
  },
  data() {
    return {
      schedules: [] as Schedule[],
      errorMessage: "error" as String,
      hidden: false,
      id: 1,
    };
  },
  methods: {
    findSchedules(courses: SectionsData[]): void {
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
      if (result.length > 500) {
        this.error("There are too many schedules to render. Please deselect some sections.");
      } else {
        this.schedules = result;
        this.id = parseInt(nanoid(20));
      }
    },
    isValidSchedule(schedule: Schedule) {
      for (let day of Object.keys(WeekDays)) {
        let first: Section;
        let second: Section;
        for (let section of schedule) {
          if ((section as any)[day] == "True") {
            if (first! === undefined) {
              first = section;
            } else {
              second = section;
              if (this.getHours(first.EndTime) == this.getHours(second.StartTime)) {
                if (this.getMinutes(first.EndTime) > this.getMinutes(second.StartTime)) return false;
              }
              if (this.getHours(first.EndTime) > this.getHours(second.StartTime)) return false;
              first = second;
            }
          }
        }
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
    error(str: string) {
      alert("Error: " + str);
    },
  },
});
</script>

<style>
#container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 961px) {
  #container {
    display: flex;
    flex-direction: row;
  }
}

* {
  font-family: "Noto Sans Display", sans;
}
::-webkit-scrollbar {
  width: 20px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}
</style>
