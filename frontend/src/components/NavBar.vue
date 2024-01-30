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
          <li><router-link to="/customers">Customers</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
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
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    hideMenu() {
      this.isMenuVisible = false;
    },
  },
};
</script>
