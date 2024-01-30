<template>
  <NavBar />
  <router-view/>
  <hr />
</template>

<script>
import "@/styles/main.css"
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      serverUrl: "",
    };
  }
};
</script>
