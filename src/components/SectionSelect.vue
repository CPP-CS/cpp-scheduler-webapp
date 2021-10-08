<template>
  <div id="sectionSelectContainer">
    <input type="checkbox" :checked="section.Selected" name="selected" id="checkbox" @click="switchSelected" />
    <div id="sectionContainer">
      <h3>Section: {{ section.Section }}</h3>
      <h3>Instructor: {{ section.Instructor }}</h3>
      <h3>Building: {{ section.Building }} Room: {{ section.Room }}</h3>
      <h3>
        Time: {{ convertTime(section.StartTime) }} -
        {{ convertTime(section.EndTime) }}
      </h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Section } from "@/Classes";
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "SectionSelect",
  props: {
    section: Object as () => Section,
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
    switchSelected() {
      this.$emit("switch-selected", this.section?.Section);
    },
  },
});
</script>

<style scoped>
#checkbox {
  margin: 10px;
}
#sectionSelectContainer {
  box-sizing: border-box;
  border: 1px solid black;
  margin: 2px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
#sectionContainer {
  line-height: 1.3em;
}
</style>
