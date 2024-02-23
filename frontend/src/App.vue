<template>
  <div class="overlay-darkener" :class="{ 'darkener-active': darkener }"></div>
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
      darkener: false,
      popup: false,
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
    this.$eventBus.on("togglePopup", this.togglePopup);
    this.$eventBus.on("toggleMenu", this.toggleMenu);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    document.removeEventListener("mousemove", this.resetInactivityTimeout);
    document.removeEventListener("keydown", this.resetInactivityTimeout);
    this.$eventBus.off("inactivityTimeout", this.resetInactivityTimeout);
    this.$eventBus.off("loading", this.checkLoading);
    this.$eventBus.off("noResponse", this.checkNoResponse);
    this.$eventBus.off("togglePopup", this.togglePopup);
    this.$eventBus.off("toggleMenu", this.toggleMenu);
  },
  methods: {
    checkScreenSize() {
      this.smallScreen = window.innerWidth <= 768;
      this.checkDarkener();
    },
    checkDarkener() {
      if (this.popup) {
        this.darkener = true;
      } else if (this.openedMenu) {
        if (this.smallScreen) {
          this.darkener = true;
        } else {
          this.darkener = false;
        }
      } else {
        this.darkener = false;
      }
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
    togglePopup(status) {
      console.log("toggling popup!");
      this.popup = status.opened;
      this.checkDarkener();
    },
    toggleMenu(status) {
      console.log("toggling menu!");
      this.openedMenu = status.opened;
      this.checkDarkener();
    },
  },
};
</script>
