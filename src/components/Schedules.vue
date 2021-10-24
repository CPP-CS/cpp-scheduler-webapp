<template>
  <div id="schedulesContainer">
    <div id="schedules">
      <div id="arrows">
        <button @mousedown="repeat(decrementSelectedSchedule, 1000)" @mouseup="stopRepeat">
          <fa icon="caret-square-left" />
        </button>

        <h3>{{ scheduleCount == 0 ? 0 : selectedSchedule + 1 }} / {{ scheduleCount }}</h3>
        <button @mousedown="repeat(incrementSelectedSchedule, 1000)" @mouseup="stopRepeat">
          <fa icon="caret-square-right" />
        </button>
      </div>

      <ScheduleView :selectedSchedule="selectedSchedule" @select-section="selectSection" />
    </div>
    <SectionData :selectedSection="selectedSection" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ScheduleView from "./ScheduleView.vue";
import SectionData from "./SectionData.vue";
import { Schedule } from "@/Classes";

export default defineComponent({
  name: "Schedules",
  data() {
    return {
      selectedSection: {},
      selectedSchedule: 0,
      timeout: 0,
    };
  },
  computed: {
    schedules(): Schedule[] {
      return this.$store.getters.getSchedules;
    },
    scheduleCount() {
      return this.$store.getters.getSchedules.length;
    },
  },
  watch: {
    scheduleCount() {
      if (this.selectedSchedule > this.scheduleCount) this.selectedSchedule = this.scheduleCount;
    },
  },
  methods: {
    selectSection(courseIndex: Number) {
      this.selectedSection = this.$store.state.schedules[this.selectedSchedule][courseIndex.valueOf()];
    },

    error(str: string) {
      alert("Error: " + str);
    },
    decrementSelectedSchedule() {
      if (this.selectedSchedule < 1) return;
      this.selectedSchedule--;
    },
    incrementSelectedSchedule() {
      if (this.selectedSchedule >= this.$store.state.schedules.length - 1) return;
      this.selectedSchedule++;
    },
    repeat(change: Function, initialTime: number) {
      change();
      this.timeout = setTimeout(() => this.repeat(change, initialTime), initialTime);
      initialTime /= 2;
    },
    stopRepeat() {
      clearTimeout(this.timeout);
    },
  },
  components: {
    ScheduleView,
    SectionData,
  },
});
</script>

<style>
#arrows {
  width: 80%;
  justify-content: space-around;
  display: flex;
  flex-direction: row;
  align-items: center;
}
#schedulesContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
}
#schedules {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  height: 80vh;
}
@media (min-width: 961px) {
  #schedulesContainer {
    width: 75%;
    flex-direction: row;
  }
  #schedules {
    width: 75%;
    height: 100%;
    max-height: 100vh;
  }
}
button {
  height: 2em;
  width: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}
svg {
  font-size: 2em;
}
</style>
