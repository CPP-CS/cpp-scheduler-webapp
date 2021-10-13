// options: subject, course number, mode
<template>
  <form id="courseQueryContainer">
    <label for="term">Select a term:</label>
    <select name="term" id="term">
      <option v-for="term in terms" :key="term" value="term.query">{{ term.name }}</option>
    </select>

    <input v-model="subject" type="text" placeholder="Course Subject (ex. CS)" id="subject" />

    <input v-model="courseNumber" type="text" placeholder="Course Number (ex. 1400)" id="courseNumber" />

    <input @click="findSections" type="button" value="Find Course" />
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
      terms: [
        {
          query: "Sp22",
          name: "Spring 2022",
        },
      ],
    };
  },
  created() {
    window.addEventListener("keyup", (event) => {
      if (event.code == "Enter") {
        this.findSections();
      }
    });
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
  padding: 1em 0.2em;
  border-radius: 5px;
  border: gray solid 3px;
  display: flex;
  flex-direction: column;
}
label {
  margin: 0 10px;
}
select,
input {
  margin: 10px 10px 10px 10px;
}
</style>
