<template>
  <div id="sectionsSelectorContainer">
    <div id="selectorHeader">
      <div id="title">
        <h3>{{ course.name }}: {{ course.sections[0].ClassTitle }}</h3>
        <fa id="arrow" :icon="getIcon" @click="iconClicked" />
      </div>
      <fa icon="trash" @click="deleteCourse" id="delete" />
    </div>

    <div id="sections" v-if="!hidden">
      <SectionSelect
        v-for="section in course.sections"
        :key="section"
        :section="section"
        @switch-selected="switchSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Course } from "@/Classes";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { defineComponent } from "vue";
import SectionSelect from "./SectionSelect.vue";

export default defineComponent({
  name: "SectionsSelector",
  props: {
    course: Object as () => Course,
  },
  components: {
    SectionSelect,
  },
  emits: ["switch-selected", "delete-course"],
  methods: {
    switchSelected(sectionNumber: number) {
      this.$emit("switch-selected", sectionNumber, this.course?.name);
    },
    iconClicked() {
      this.hidden = !this.hidden;
    },
    deleteCourse() {
      this.$emit("delete-course", this.course?.name);
    },
  },
  data() {
    return {
      hidden: false,
    };
  },
  computed: {
    getIcon() {
      return this.hidden ? faChevronUp : faChevronDown;
    },
  },
});
</script>

<style scoped lang="scss">
#sectionsSelectorContainer {
  box-sizing: border-box;
  border: black solid 1px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  margin: 5px 0;
  max-height: 40vh;
  width: 100%;
}
#selectorHeader {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-content: space-between;
  padding: 5px;
  border-bottom: black solid 1px;
}
#delete {
  :hover {
    filter: invert(76%) sepia(0%) saturate(3820%) hue-rotate(15deg) brightness(91%) contrast(86%);
  }
  align-self: center;
  width: 20%;
  height: 20px;
}
#title {
  font-size: 1.2em;
  font-weight: 600;
  align-self: left;
  width: 80%;
  display: flex;
  flex-direction: column;
}

#arrow {
  height: 20px;
  width: 20px;
  align-self: flex-start;
}

#sections {
  height: 100%;

  overflow-y: scroll;
  min-height: auto;
}
</style>
