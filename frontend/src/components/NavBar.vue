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
      <li v-if="session.logged && session.userData.role === 'admin'">
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/customers/list' }"
          to="/customers/list"
          >⚙️ Customers</router-link
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
        v-if="session.userData.role === 'admin'"
        width="30px"
        height="30px"
        viewBox="0 0 640 512"
      >
        <path
          d="M610.5 373.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3.7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3.4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 400.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm201.2 226.5c-2.3-1.2-4.6-2.6-6.8-3.9l-7.9 4.6c-6 3.4-12.8 5.3-19.6 5.3-10.9 0-21.4-4.6-28.9-12.6-18.3-19.8-32.3-43.9-40.2-69.6-5.5-17.7 1.9-36.4 17.9-45.7l7.9-4.6c-.1-2.6-.1-5.2 0-7.8l-7.9-4.6c-16-9.2-23.4-28-17.9-45.7.9-2.9 2.2-5.8 3.2-8.7-3.8-.3-7.5-1.2-11.4-1.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c10.1 0 19.5-3.2 27.2-8.5-1.2-3.8-2-7.7-2-11.8v-9.2z"
        />
      </svg>
      <svg
        v-else
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
        v-if="session.userData.role === 'admin'"
        width="30px"
        height="30px"
        viewBox="0 0 640 512"
      >
        <path
          d="M610.5 373.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3.7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3.4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 400.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm201.2 226.5c-2.3-1.2-4.6-2.6-6.8-3.9l-7.9 4.6c-6 3.4-12.8 5.3-19.6 5.3-10.9 0-21.4-4.6-28.9-12.6-18.3-19.8-32.3-43.9-40.2-69.6-5.5-17.7 1.9-36.4 17.9-45.7l7.9-4.6c-.1-2.6-.1-5.2 0-7.8l-7.9-4.6c-16-9.2-23.4-28-17.9-45.7.9-2.9 2.2-5.8 3.2-8.7-3.8-.3-7.5-1.2-11.4-1.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c10.1 0 19.5-3.2 27.2-8.5-1.2-3.8-2-7.7-2-11.8v-9.2z"
        />
      </svg>
      <svg
        v-else
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
      <li
        v-if="session.logged && session.userData.role === 'admin'"
        @click="hideMenu"
      >
        <router-link
          class="nav-link"
          :class="{ 'tab-active': viewActive === '/customers/list' }"
          to="/customers/list"
          >⚙️ Customers</router-link
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
    this.$eventBus.emit("toggleDarkener", { enabled: false });
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
