<template>
  <div id="sectionViewContainer">
    <h3 id="header">Section Information</h3>
    <div v-if="Object.keys(selectedSection).length == 0">
      Please click a section for more information
    </div>
    <div v-else id="sectionInformationContainer">
      <h3>Section #: {{ selectedSection.Section }}</h3>
      <h3>Course: {{ selectedSection.Subject }}{{ selectedSection.CourseNumber }}({{ selectedSection.Units }})</h3>
      <h3>Instructor: {{ selectedSection.Instructor }}</h3>
      <h3>Days: {{ getDays() }}</h3>
      <h3>Time: {{ convertTime(selectedSection.StartTime) }} - {{ convertTime(selectedSection.EndTime) }}</h3>
      <h3>Location: Bldg {{ selectedSection.Building }} Rm {{ selectedSection.Room }}</h3>
      <h3>Class #: {{ selectedSection.ClassNumber }}</h3>
      <h3>Instruction Mode: {{ selectedSection.InstructionMode }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Section, WeekDays } from "@/Classes";
export default defineComponent({
  name: "SectionData",
  props: {
    selectedSection: Object as PropType<Section>,
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
    getDays(): String {
      let res = "";
      for (let day of Object.keys(WeekDays)) {
        res += (this.selectedSection as any)[day] == "True" ? day.substring(0, 3) + " " : "";
      }
      return res;
    },
  },
});
</script>

<style scoped>
#header {
  font-size: 3em;
}
#sectionInformationContainer {
  line-height: 1.5em;
  font-size: 1.5em;
}
#sectionViewContainer {
  padding: 0 5%;
  border-top: black solid 1px;
  margin: 1%;
  height: 50vh;
}
@media (min-width: 961px) {
  #sectionViewContainer {
    margin: 0;
    padding: 1%;
    box-sizing: border-box;
    height: 100vh;
    border-top: 0;
    border-left: 1px solid black;
  }
}
</style>
