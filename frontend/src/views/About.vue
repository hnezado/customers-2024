<template>
  <div class="main-container">
    <h1>About</h1>
    <p>💻 Hey there! I'm Hector Martinez</p>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
  },
};
</script>
