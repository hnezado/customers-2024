<template>
  <header>
    <div class="navbar">
      <div class="menu-toggle" @click="toggleMenu">
        <span v-if="!isMenuVisible">&#9776;</span>
        <span v-else>&#10006;</span>
      </div>
      <nav :class="{ 'show-menu': isMenuVisible }" @click="hideMenu">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/customers/list">Customers</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
          <div v-if="logged" class="profile-but">
            <router-link to="/profile" class="profile-link"
              ><img
                src="@/assets/icon_profile.svg"
                alt="Profile Icon"
                class="icon"
              />Hello,<br />{{ userData.username }}
            </router-link>
          </div>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import "@/styles/components/NavBar.css";

export default {
  name: "NavBar",
  data() {
    return {
      isMenuVisible: false,
      userData: {},
      logged: false,
    };
  },
  mounted() {
    this.$eventBus.on("userSession", this.handleUserSession);
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    hideMenu() {
      this.isMenuVisible = false;
    },
    handleUserSession(status) {
      this.userData = JSON.parse(sessionStorage.getItem("userData"));
      this.logged = status.logged;
    },
  },
};
</script>
