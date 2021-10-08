<template>
  <div id="courseSelectContainer">
    <SectionsSelector
      :key="sectionsData"
      v-for="sectionsData in courses"
      :sectionsData="sectionsData"
      @switch-selected="switchSelected"
    />
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
  emits: ["switch-selected"],
  methods: {
    switchSelected(sectionNumber: number, className: string) {
      this.$emit("switch-selected", sectionNumber, className);
    },
  },
});
</script>

<style scoped>
#courseSelectContainer {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
</style>
