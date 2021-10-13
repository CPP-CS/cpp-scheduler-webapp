<template>
  <div id="courseSelectContainer">
    <h3 id="title">Select Sections</h3>
    <SectionsSelector
      :key="sectionsData"
      v-for="sectionsData in courses"
      :sectionsData="sectionsData"
      @switch-selected="switchSelected"
      @delete-course="deleteCourse"
    />
    <input type="button" value="Find Schedules" @click="findSchedules" class="button" />
  </div>
</template>

<script lang="ts">
import { SectionsData } from "@/Classes";
import { defineComponent, PropType } from "vue";
import SectionsSelector from "./SectionsSelector.vue";

export default defineComponent({
  name: "CourseSelect",
  props: {
    courses: Array as PropType<Array<SectionsData>>,
  },
  components: {
    SectionsSelector,
  },
  emits: ["switch-selected", "find-schedules", "delete-course"],
  methods: {
    switchSelected(sectionNumber: number, className: string) {
      this.$emit("switch-selected", sectionNumber, className);
    },
    findSchedules() {
      this.$emit("find-schedules");
    },
    deleteCourse(sectionName: string) {
      this.$emit("delete-course", sectionName);
    },
  },
});
</script>

<style scoped>
#title {
  align-self: start;
  font-size: 2em;
  padding-bottom: 10px;
}
#courseSelectContainer {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.button {
  align-self: center;
  margin-top: 10px;
}
</style>
