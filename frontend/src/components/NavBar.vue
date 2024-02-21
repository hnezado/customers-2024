<template>
  <div
    v-if="smallScreen"
    id="v-navbar-toggle"
    @click="toggleMenu"
    :style="{ color: menuToggleColor }"
  >
    {{ openedMenu ? "✖" : "☰" }}
  </div>
  <nav v-if="!smallScreen" id="navbar">
    <ul>
      <li>
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/' }"
          to="/"
          >Home</router-link
        >
      </li>
      <li>
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/catalog' }"
          to="/catalog"
          >Products</router-link
        >
      </li>
      <li v-if="session.logged">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/customers/list' }"
          to="/customers/list"
          >Customers</router-link
        >
      </li>
      <li>
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/locations' }"
          to="/locations"
          >Locations</router-link
        >
      </li>
      <li>
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/contact' }"
          to="/contact"
          >Contact</router-link
        >
      </li>
    </ul>
    <div
      v-if="session.logged"
      class="nav-link profile-link"
      :class="{ 'tab-active': viewActive === '/profile' }"
      @click="goToProfile"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="30px"
        y="30px"
        viewBox="0 0 256 256"
        xml:space="preserve"
      >
        <g>
          <path
            d="M68.3,69.8c0,33,26.8,59.8,59.8,59.8c33,0,59.8-26.8,59.8-59.8c0-33-26.8-59.8-59.8-59.8C95.1,10,68.3,36.8,68.3,69.8L68.3,69.8z"
          />
          <path
            d="M129.5,140.2c13.9,0.4,19,1.2,44.1-16.3c4.4-4.8,9.1-5.6,13.1-5.6s24.6,3.2,35.7,25c11.1,21.8,15.5,48.5,13.1,67.9c-2.4,19.5-14.3,33-40.1,34.1c-25.8,1.2-143,0-143,0c-19.5,0-32.2-19.5-32.6-41.3c-0.4-21.8,4-50,16.3-67.5c12.3-17.5,32.2-19.1,38.1-17.1C87,124,99.7,139.4,129.5,140.2z"
          />
        </g>
      </svg>
      <div>{{ session.userData.username }}</div>
      <!-- <div>Ataulfaciodemisamores de los santos</div> -->
    </div>
  </nav>
  <nav
    v-if="smallScreen"
    id="v-navbar"
    :class="{ 'v-navbar-active': openedMenu }"
  >
    <div
      v-if="session.logged"
      class="nav-link profile-link"
      :class="{ 'tab-active': viewActive === '/profile' }"
      @click="goToProfile"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="30px"
        y="30px"
        viewBox="0 0 256 256"
        xml:space="preserve"
      >
        <g>
          <path
            d="M68.3,69.8c0,33,26.8,59.8,59.8,59.8c33,0,59.8-26.8,59.8-59.8c0-33-26.8-59.8-59.8-59.8C95.1,10,68.3,36.8,68.3,69.8L68.3,69.8z"
          />
          <path
            d="M129.5,140.2c13.9,0.4,19,1.2,44.1-16.3c4.4-4.8,9.1-5.6,13.1-5.6s24.6,3.2,35.7,25c11.1,21.8,15.5,48.5,13.1,67.9c-2.4,19.5-14.3,33-40.1,34.1c-25.8,1.2-143,0-143,0c-19.5,0-32.2-19.5-32.6-41.3c-0.4-21.8,4-50,16.3-67.5c12.3-17.5,32.2-19.1,38.1-17.1C87,124,99.7,139.4,129.5,140.2z"
          />
        </g>
      </svg>
      <div>{{ session.userData.username }}</div>
      <!-- <div>Ataulfaciodemisamores de los santos</div> -->
    </div>
    <hr />
    <ul>
      <li @click="hideMenu">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/' }"
          to="/"
          >Home</router-link
        >
      </li>
      <li @click="hideMenu">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/catalog' }"
          to="/catalog"
          >Products</router-link
        >
      </li>
      <li v-if="session.logged" @click="hideMenu">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/customers/list' }"
          to="/customers/list"
          >Customers</router-link
        >
      </li>
      <li @click="hideMenu">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/locations' }"
          to="/locations"
          >Locations</router-link
        >
      </li>
      <li @click="hideMenu">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/contact' }"
          to="/contact"
          >Contact</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import "@/styles/components/NavBar.css";

export default {
  name: "NavBar",
  data() {
    return {
      smallScreen: false,
      session: {},
      openedMenu: false,
      menuToggleColor: "#333333",
      viewActive: "",
    };
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
    this.$eventBus.on("session", this.handleSession);
    this.$eventBus.on("viewActive", this.handleViewActive);
    this.$eventBus.emit("toggleMenu", { opened: false });
    const [userData, logged] = this.checkSession();
    if (logged) {
      this.updateSession(userData, logged);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
    this.$eventBus.off("session", this.handleSession);
  },
  computed: {
    computedMenuToggleColor() {
      return this.menuToggleColor;
    },
  },
  methods: {
    checkScreenSize() {
      this.smallScreen = window.innerWidth <= 768;
    },
    checkSession() {
      const userData = sessionStorage.getItem("userData") || {};
      const logged = Boolean(Object.keys(userData).length);
      return [logged ? JSON.parse(userData) : {}, logged];
    },
    updateSession(userData, logged) {
      this.session.userData = userData;
      this.session.logged = logged;
    },
    handleSession(status) {
      this.session.logged = status.logged;
      this.session.userData = JSON.parse(sessionStorage.getItem("userData"));
    },
    handleViewActive(data) {
      this.viewActive = data.view;
    },
    toggleMenu() {
      this.openedMenu = !this.openedMenu;
      this.menuToggleColor = this.openedMenu ? "#FFFFFF" : "#333333";
      this.$eventBus.emit("toggleMenu", { opened: this.openedMenu });
    },
    hideMenu() {
      this.openedMenu = false;
      this.menuToggleColor = this.openedMenu ? "#FFFFFF" : "#333333";
      this.$eventBus.emit("toggleMenu", { opened: this.openedMenu });
    },
    goToProfile() {
      console.log("going to profile");
      this.hideMenu();
      this.$router.push("/profile");
    },
  },
};
</script>
