<template>
  <div v-if="openedMenu" class="overlay-darkener" @click="overClick"></div>
  <NavBar />
  <router-view />
  <br />
  <hr />
</template>

<script>
import "@/styles/main.css";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      serverUrl: "",
      openedMenu: false,
    };
  },
  mounted() {
    this.$eventBus.on("toggleMenu", this.toggleMenu);
  },
  beforeUnmount() {
    this.$eventBus.off("toggleMenu", this.toggleMenu);
  },
  methods: {
    toggleMenu(status) {
      this.openedMenu = status.opened;
    },
    overlayClick() {
      if (this.openedMenu) {
        this.$eventBus.emit("toggleMenu", { opened: false });
        console.log("overlayClick", this.openedMenu);
      }
    },
  },
};
</script>
