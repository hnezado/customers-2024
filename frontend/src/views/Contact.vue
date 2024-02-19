<template>
  <div class="main-container">
    <h1>Contact</h1>
    <p>Hey there! I'm Hector Martinez</p>
    <p>
      If you have questions, suggestions, or just want to say hello, feel free
      to get in touch.
    </p>
    <br />
    <p>
      💻 Contact me via email at
      <a class="link" href="#">contact@customers2024.com</a>
    </p>
    <p>or through my social networks 😎</p>
    <div class="social-icons">
      <a
        href="https://github.com/hnezado"
        target="_blank"
        data-tooltip="GitHub"
        class="icon-tooltip"
      >
        <!-- <svg class="icon">
          <use xlink:href="media/github.svg#icon-github" />
        </svg> -->
        <img class="icon" src="media/github.svg" alt="GitHub-icon" />
      </a>
      <a
        href="https://www.linkedin.com/in/hector-md"
        target="_blank"
        class="icon"
        data-tooltip="LinkedIn"
      >
        <svg>
          <use xlink:href="media/linkedin.svg#icon-linkedin" />
        </svg>
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
