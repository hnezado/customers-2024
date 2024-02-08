<template>
  <div
    v-if="openedMenu && smallScreen"
    class="overlay-darkener"
    @click="overClick"
  ></div>
  <NavBar />
  <router-view />
  <NoResponse :responseData="noResponse" />
  <Spinner :isLoading="isLoading" />
  <br />
  <hr />
</template>

<script>
import "@/styles/main.css";
import NavBar from "@/components/NavBar.vue";
import NoResponse from "@/components/NoResponse.vue";
import Spinner from "@/components/Spinner.vue";

export default {
  name: "App",
  components: {
    NavBar,
    Spinner,
    NoResponse,
  },
  data() {
    return {
      isLoading: false,
      noResponse: {},
      serverUrl: "",
      openedMenu: false,
      smallScreen: false,
    };
  },
  mounted() {
    window.addEventListener("resize", this.checkScreenSize);
    this.checkScreenSize();
    this.$eventBus.on("loading", this.checkLoading);
    this.$eventBus.on("noResponse", this.checkNoResponse);
    this.$eventBus.on("toggleMenu", this.toggleMenu);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    this.$eventBus.off("loading", this.checkLoading);
    this.$eventBus.off("noResponse", this.checkNoResponse);
    this.$eventBus.off("toggleMenu", this.toggleMenu);
  },
  methods: {
    checkLoading(data) {
      this.isLoading = data.status;
    },
    checkNoResponse(data) {
      this.noResponse = data;
    },
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
