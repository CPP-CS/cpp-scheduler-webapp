// options: subject, course number, mode
<template>
  <form id="courseQueryContainer">
    <input
      v-model="subject"
      type="text"
      placeholder="Course Subject (ex. CS)"
      id="subject"
    />

    <input
      v-model="courseNumber"
      type="text"
      placeholder="Course Number (ex. 1400)"
      id="courseNumber"
    />

    <input @click="findSections" type="button" value="Find Sections" />
  </form>
</template>

<script>
export default {
  name: "CourseQuery",
  data() {
    return {
      subject: "",
      courseNumber: "",
      mode: "Any Mode",
    };
  },
  methods: {
    findSections() {
      this.$emit("find-sections", this.subject, this.courseNumber);
    },
  },
};
</script>

<style scoped>
#courseQueryContainer {
  border-radius: 5px;
  border: gray solid 3px;
}
</style>
