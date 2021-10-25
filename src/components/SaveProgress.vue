<template>
  <div id="saveProgressContainer">
    <h3 id="instructions">
      Copy your courses/sections data. Send it to your friends, backup your data, or transfer it to a different device.
      It's recomended that you save this data token on a text file or word document in your computer.
    </h3>
    <button @click="copySaveData" id="copyDataButton">Click to Copy Save Data Token</button>

    <label name="pasteBox">Paste Your Token Below:</label>
    <input type="text" name="pasteBox" id="pasteBox" v-model="input" />
    <button @click="readSaveData" id="loadDataButton">Load Save Data Token</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SaveProgress",
  data() {
    return {
      input: "",
    };
  },
  methods: {
    copySaveData() {
      navigator.clipboard.writeText(this.$store.getters.getSaveData);
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
#copyDataButton {
  margin: 5%;
  width: auto;
}
#loadDataButton {
  width: auto;
  margin: 3%;
}
</style>
