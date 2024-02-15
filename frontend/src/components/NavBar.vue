<template>
  <div
    v-if="smallScreen"
    id="menu-toggle"
    @click="toggleMenu"
    :style="{ color: menuToggleColor }"
  >
    {{ openedMenu ? "✖" : "☰" }}
  </div>
  <nav v-if="!smallScreen" id="navbar">
    <ul id="page-links">
      <li>
        <router-link :class="getTabClass('/')" to="/">Home</router-link>
      </li>
      <li>
        <router-link :class="getTabClass('/catalog')" to="/catalog"
          >Products</router-link
        >
      </li>
      <li v-if="session.logged">
        <router-link
          :class="getTabClass('/customers/list')"
          to="/customers/list"
          >Customers</router-link
        >
      </li>
      <li>
        <router-link :class="getTabClass('/about')" to="/about"
          >About</router-link
        >
      </li>
      <li>
        <router-link :class="getTabClass('/contact')" to="/contact"
          >Contact</router-link
        >
      </li>
    </ul>
    <div v-if="session.logged">
      <router-link
        :class="getTabClass('/profile')"
        to="/profile"
        class="profile-link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -256 1792 1792"
          class="profile-icon"
        >
          <use xlink:href="@/assets/icon_profile.svg#icon-profile" />
        </svg>
        <span>{{ session.userData.username }}</span>
      </router-link>
    </div>
  </nav>
  <div v-if="smallScreen" id="v-menu" :class="{ 'v-menu-active': openedMenu }">
    <ul>
      <div v-if="session.logged" class="profile-but" @click="hideMenu">
        <br />
        <router-link
          :class="getTabClass('/profile')"
          to="/profile"
          class="profile-link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792">
            <use xlink:href="@/assets/icon_profile.svg#icon-profile" />
          </svg>
          {{ session.userData.username }}
        </router-link>
      </div>
      <hr />
      <br />
      <li @click="hideMenu">
        <router-link :class="getTabClass('/')" to="/">Home</router-link>
      </li>
      <li @click="hideMenu">
        <router-link :class="getTabClass('/catalog')" to="/catalog"
          >Products</router-link
        >
      </li>
      <li v-if="session.logged" @click="hideMenu">
        <router-link
          :class="getTabClass('/customers/list')"
          to="/customers/list"
          >Customers</router-link
        >
      </li>
      <li @click="hideMenu">
        <router-link :class="getTabClass('/about')" to="/about"
          >About</router-link
        >
      </li>
      <li @click="hideMenu">
        <router-link :class="getTabClass('/contact')" to="/contact"
          >Contact</router-link
        >
      </li>
    </ul>
  </div>
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
    getTabClass(route) {
      return this.viewActive === route ? "tab-active" : "tab-inactive";
    },
  },
};
</script>
