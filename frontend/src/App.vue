<template>
  <div
    v-if="smallScreen"
    class="overlay-darkener"
    :class="{ 'darkener-active': openedMenu }"
  ></div>
  <NavBar />
  <router-view />
  <NoResponse :responseData="noResponse" />
  <Spinner :isLoading="isLoading" />
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
      smallScreen: false,
      inactivityTimeout: null,
      isLoading: false,
      noResponse: {},
      serverUrl: "",
      openedMenu: false,
    };
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
    document.addEventListener("mousemove", this.resetInactivityTimeout);
    document.addEventListener("keydown", this.resetInactivityTimeout);
    this.$eventBus.on("loading", this.checkLoading);
    this.$eventBus.on("noResponse", this.checkNoResponse);
    this.$eventBus.on("toggleMenu", this.toggleMenu);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    document.removeEventListener("mousemove", this.resetInactivityTimeout);
    document.removeEventListener("keydown", this.resetInactivityTimeout);
    this.$eventBus.off("inactivityTimeout", this.resetInactivityTimeout);
    this.$eventBus.off("loading", this.checkLoading);
    this.$eventBus.off("noResponse", this.checkNoResponse);
    this.$eventBus.off("toggleMenu", this.toggleMenu);
  },
  methods: {
    checkScreenSize() {
      this.smallScreen = window.innerWidth <= 768;
    },
    resetInactivityTimeout() {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(this.clearSession, 3600000);
    },
    clearSession() {
      const currentSession = sessionStorage.getItem("userData");
      console.log("Clearing current Session:", currentSession);
      sessionStorage.clear();
      const clearedSession = sessionStorage.getItem("userData");
      console.log("Cleared session:", clearedSession);
      this.$eventBus.emit("session", { logged: false });
    },
    checkLoading(data) {
      this.isLoading = data.status;
    },
    checkNoResponse(data) {
      this.noResponse = data;
    },
    toggleMenu(status) {
      this.openedMenu = status.opened;
    },
  },
};
</script>
