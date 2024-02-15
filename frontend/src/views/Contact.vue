<template>
  <div class="main-container">
    <h1>Contact</h1>
    <div class="social-icons">
      <a
        href="https://github.com/hnezado"
        target="_blank"
        class="icon"
        data-tooltip="GitHub"
      >
        <img :src="require('@/assets/github.svg')" alt="GitHub-icon" />
      </a>
      <a
        href="https://www.linkedin.com/in/hector-md/"
        target="_blank"
        class="icon"
        data-tooltip="LinkedIn"
      >
        <img :src="require('@/assets/linkedin.svg')" alt="LinkedIn-icon" />
      </a>
    </div>
  </div>
</template>

<script>
import "@/styles/components/Contact.css";

export default {
  name: "ContactPage",
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
  },
};
</script>
