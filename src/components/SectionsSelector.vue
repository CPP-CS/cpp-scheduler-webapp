<template>
  <div id="sectionsSelectorContainer">
    <div id="title">{{ sectionsData.name }}: {{ sectionsData.sections[0].ClassTitle }}</div>
    <div id="sections">
      <SectionSelect
        v-for="section in sectionsData.sections"
        :key="section"
        :section="section"
        @switch-selected="switchSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { SectionsData } from "@/Classes";
import { defineComponent } from "vue";
import SectionSelect from "./SectionSelect.vue";

export default defineComponent({
  name: "SectionsSelector",
  props: {
    sectionsData: Object as () => SectionsData,
  },
  components: {
    SectionSelect,
  },
  emits: ["switch-selected"],
  methods: {
    switchSelected(sectionNumber: number) {
      this.$emit("switch-selected", sectionNumber, this.sectionsData?.name);
    },
  },
});
</script>

<style scoped lang="scss">
#sectionsSelectorContainer {
  margin: 2px;
  box-sizing: border-box;
  border: black solid 1px;
  width: calc(25% - 4px);
  display: flex;
  flex-direction: column;
  background-color: lightgrey;
  border-radius: 10px;
}
#title {
  padding: 5px;
  font-size: 1.2em;
  border-bottom: black solid 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
}
#sections {
  height: 100%;
  max-height: 20vh;
  overflow-y: scroll;
  min-height: auto;
}
::-webkit-scrollbar {
  width: 20px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-thumb:hover {
  background-color: white;
  // background-color: #a8bbbf;
}
</style>
