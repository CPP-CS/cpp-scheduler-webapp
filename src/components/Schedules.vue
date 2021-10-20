<template>
  <div id="schedulesContainer">
    <div id="schedules">
      <ScheduleView
        :schedule="schedules[index - 1]"
        v-for="index in schedules.length"
        :key="index"
        @select-section="selectSection"
      />
    </div>
    <SectionData :selectedSection="selectedSection" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ScheduleView from "./ScheduleView.vue";
import SectionData from "./SectionData.vue";
import { Schedule, Section } from "@/Classes";

export default defineComponent({
  name: "Schedules",
  props: {
    schedules: Array as PropType<Array<Schedule>>,
  },
  data() {
    return {
      selectedSection: {} as Section,
    };
  },
  components: {
    ScheduleView,
    SectionData,
  },
  methods: {
    selectSection(section: Section) {
      this.selectedSection = section;
    },
  },
});
</script>

<style>
#schedulesContainer {
  display: flex;
  flex-direction: column;
}
#schedules {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0;
  max-height: 50vh;
  overflow-y: scroll;
}
@media (min-width: 961px) {
  #schedulesContainer {
    width: 75%;
    flex-direction: row;
  }
  #schedules {
    width: 80%;
    height: 100%;
    max-height: 100vh;
  }
}
</style>
