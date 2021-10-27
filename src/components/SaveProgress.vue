<template>
  <div id="saveProgressContainer">
    <h3>[HIGHLY EXPERIMENTAL]</h3>
    <h3 id="instructions">
      Copy your courses/sections data. Send it to your friends, backup your data, or transfer it to a different device.
      It's recomended that you save this data token on a text file or word document in your computer.
    </h3>
    <button @click="generateSaveData" id="generateDataButton">Click to Generate Save Data Token</button>
    <textarea
      id="output"
      ref="output"
      @dblclick="this.$refs.output.setSelectionRange(0, this.$refs.output.value.length)"
      v-model="saveToken"
      readonly
    />

    <label name="pasteBox">Paste Your Token Below:</label>
    <input type="text" name="pasteBox" id="pasteBox" v-model="input" />
    <button @click="readSaveData" id="loadDataButton">Load Save Data Token</button>
  </div>
</template>

<script lang="ts">
import { SaveData } from "@/Classes";

import { defineComponent } from "vue";

export default defineComponent({
  name: "SaveProgress",
  data() {
    return {
      input: "",
      saveToken: "",
    };
  },
  methods: {
    async generateSaveData() {
      let saveData: SaveData = {
        breaks: this.$store.state.breaks,
        courses: [],
        activeSections: [],
      };
      for (let course of this.$store.state.courses) {
        saveData.courses.push({
          subject: course.sections[0].Subject,
          courseNumber: course.sections[0].CourseNumber.toString(),
        });
        for (let section of course.sections) {
          if (section.Selected) {
            saveData.activeSections.push(section.ClassNumber);
          }
        }
      }

      // this.saveToken = await LZUTF8.compress(JSON.stringify(saveData), {
      //   outputEncoding: "Base64",
      // });
      this.saveToken = JSON.stringify(saveData);
    },
    readSaveData() {
      this.$store.dispatch("loadSaveData", this.input);
      this.input = "";
    },
  },
});
</script>

<style scoped>
#saveProgressContainer {
  padding: 1em 0.2em;
  border-radius: 5px;
  border: gray solid 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#instructions {
  font-style: italic;
  text-align: center;
  margin: 2px;
  padding: 3%;
  padding-top: 0;
  border-bottom: black 1px solid;
}
#generateDataButton {
  margin: 5%;
  width: auto;
  margin-bottom: 0;
}
#loadDataButton {
  width: auto;
  margin: 3%;
}
#output {
  width: 80%;
  resize: none;
  text-align: center;
  margin-bottom: 5%;
}
</style>
