<template>
  <div
    v-if="smallScreen"
    id="menu-toggle"
    @click="toggleMenu"
    :style="{ color: menuToggleColor }"
  >
    {{ openedMenu ? "✖" : "☰" }}
  </div>
  <div v-if="!smallScreen" id="filler"></div>
  <nav v-if="!smallScreen" id="navbar">
    <ul id="page-links">
      <li><router-link to="/">Home</router-link></li>
      <li>
        <router-link to="/customers/list">Customers</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/contact">Contact</router-link>
      </li>
    </ul>
    <div v-if="logged" class="profile-but">
      <router-link to="/profile" class="profile-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -256 1792 1792"
          class="profile-icon"
        >
          <use xlink:href="@/assets/icon_profile.svg#icon-profile" />
        </svg>
        <span>{{ userData.username }}</span>
      </router-link>
    </div>
    <div v-else class="profile-but">
      <router-link to="/profile" class="profile-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -256 1792 1792"
          class="profile-icon"
        >
          <use xlink:href="@/assets/icon_profile.svg#icon-profile" />
        </svg>
        Ataulfo
      </router-link>
    </div>
  </nav>
  <div v-if="smallScreen && openedMenu" id="v-menu">
    <ul>
      <div v-if="logged" class="profile-but" @click="hideMenu">
        <br />
        <router-link to="/profile" class="profile-link"
          ><img
            src="@/assets/icon_profile.svg"
            alt="Profile Icon"
            class="profile-icon"
          />{{ userData.username }}
        </router-link>
      </div>
      <hr />
      <br />
      <li @click="hideMenu"><router-link to="/">Home</router-link></li>
      <li @click="hideMenu">
        <router-link to="/customers/list">Customers</router-link>
      </li>
      <li @click="hideMenu"><router-link to="/about">About</router-link></li>
      <li @click="hideMenu">
        <router-link to="/contact">Contact</router-link>
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
      logged: false,
      smallScreen: false,
      openedMenu: false,
      menuToggleColor: "#333333",
      userData: {},
    };
  },
  mounted() {
    // document.addEventListener("click", this.handleDocumentClick);
    this.$eventBus.on("userSession", this.handleUserSession);
    this.$eventBus.emit("toggleMenu", { opened: false });
    window.addEventListener("resize", this.checkScreenSize);
    this.checkScreenSize();
  },
  beforeUnmount() {
    // document.removeEventListener("click", this.handleDocumentClick);
    window.removeEventListener("resize", this.checkScreenSize);
  },
  computed: {
    computedMenuToggleColor: () => {
      return this.menuToggleColor;
    },
  },
  methods: {
    toggleMenu() {
      this.openedMenu = !this.openedMenu;
      this.menuToggleColor = this.openedMenu ? "#FFFFFF" : "#333333";
      this.$eventBus.emit("toggleMenu", { opened: this.openedMenu });
      // console.log("this.menuToggleColor", this.menuToggleColor);
      // console.log("Toggled menu.\nthis.openedMenu =", this.openedMenu);
    },
    hideMenu() {
      this.openedMenu = false;
      this.$eventBus.emit("toggleMenu", { opened: this.openedMenu });
      console.log("Hidden menu.\nthis.openedMenu =", this.openedMenu);
    },
    handleUserSession(status) {
      this.logged = status.logged;
      this.userData = JSON.parse(sessionStorage.getItem("userData"));
      // console.log(
      //   `Handled User Session.\nthis.logged = ${this.logged}\nthis.userData = ${this.userData}`
      // );
    },
    checkScreenSize() {
      this.smallScreen = window.innerWidth <= 768;
      // console.log(
      //   `Checked Screen Size.\nthis.smallScreen = ${this.smallScreen}`
      // );
    },
  },
};
</script>
