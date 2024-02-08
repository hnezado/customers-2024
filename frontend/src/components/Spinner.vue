<template>
  <div v-if="isLoading" class="loader-spinner">
    <div class="spinner-overlay">
      <div class="spinner"></div>
      <p class="loading-text">
        Loading<span class="dots">{{ loadingText }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import "@/styles/components/Spinner.css";

export default {
  name: "LoaderSpinner",
  props: {
    isLoading: Boolean,
  },
  data() {
    return {
      loadingText: "",
      textIndex: 0,
      textChangeInterval: null,
    };
  },
  methods: {
    changeText() {
      const texts = ["", ".", "..", "...", "..", "."];
      this.loadingText = texts[this.textIndex];
      this.textIndex = (this.textIndex + 1) % texts.length;
    },
  },
  watch: {
    isLoading: {
      handler() {
        if (this.isLoading) {
          this.textChangeInterval = setInterval(this.changeText, 2000 / 6);
        } else {
          clearInterval(this.textChangeInterval);
        }
      },
    },
  },
};
</script>
