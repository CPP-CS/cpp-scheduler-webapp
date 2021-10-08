<template>
  <div id="schedulesContainer">
    <h3 v-for="index in schedules.length" :key="index">
      <span v-for="section in schedules[index]" :key="section.CourseNumber">
        {{ section.Subject }}{{ section.CourseNumber }}: {{ section.Instructor }} ;
        {{ convertTime(section.StartTime) }} - {{ convertTime(section.EndTime) }} ||
      </span>
    </h3>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Schedule } from "@/Classes";

export default defineComponent({
  name: "Schedules",
  props: {
    schedules: Array as PropType<Array<Schedule>>,
  },
  methods: {
    convertTime(str: String): String {
      if (str == "TBA") return "TBA";
      if (str.length != 8) return "ERROR";
      let hours: number = parseInt(str.substring(0, 2));
      let minutes: string = str.substring(3, 5);
      let end: string;
      if (hours > 12) {
        hours -= 12;
        end = "PM";
      } else {
        end = "AM";
      }
      return `${hours}:${minutes} ${end}`;
    },
  },
});
</script>
