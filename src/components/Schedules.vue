<template>
  <div id="schedulesContainer">
    <h3 v-for="index in schedules.length" :key="index">
      <span v-for="section in schedules[index]" :key="section.CourseNumber">
        {{ section.Subject }}{{ section.CourseNumber }}: {{ section.Instructor }} ; {{ section.StartTime }} -
        {{ section.EndTime }} ||
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
});
</script>
