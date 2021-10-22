<template>
  <div id="courseSelectContainer">
    <SectionsSelector
      :key="course"
      v-for="course in courses"
      :course="course"
      @switch-selected="switchSelected"
      @delete-course="deleteCourse"
    />
    <!-- <input type="button" value="Find Schedules" @click="findSchedules" class="button" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import SectionsSelector from "./SectionsSelector.vue";

export default defineComponent({
  name: "CourseSelect",
  computed: {
    courses() {
      return this.$store.state.courses;
    },
  },
  components: {
    SectionsSelector,
  },
  methods: {
    switchSelected(sectionNumber: number, className: string) {
      this.$store.commit("switchSelected", {
        className: className,
        sectionNumber: sectionNumber,
      });
    },
    deleteCourse(courseName: string) {
      this.$store.dispatch("deleteCourse", courseName);
    },
  },
});
</script>

<style scoped>
#courseSelectContainer {
  padding: 20px 3px;
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
