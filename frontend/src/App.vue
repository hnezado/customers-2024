<template>
  <div
    v-if="openedMenu && smallScreen"
    class="overlay-darkener"
    @click="overClick"
  ></div>
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
      smallScreen: false,
    };
  },
  mounted() {
    window.addEventListener("resize", this.checkScreenSize);
    this.checkScreenSize();
    this.$eventBus.on("toggleMenu", this.toggleMenu);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    this.$eventBus.off("toggleMenu", this.toggleMenu);
  },
  methods: {
    checkScreenSize() {
      this.smallScreen = window.innerWidth <= 768;
    },
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
