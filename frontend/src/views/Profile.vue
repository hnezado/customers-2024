<template>
  <div class="profile">
    <h1>My Profile Data</h1>
    <div class="table-container">
      <table v-if="Object.keys(userData).length" class="table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in userData" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <button class="button" v-if="logged" @click="logout">Logout</button>
    <div v-if="!logged">{{ logoutMsg }}</div>
  </div>
</template>

<script>
import "@/styles/components/Profile.css";
export default {
  name: "ProfilePage",
  data() {
    return {
      userData: {},
      logged: false,
      logoutMsg: "",
    };
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      this.userData = JSON.parse(sessionStorage.getItem("userData")) || {};
      this.logged = Boolean(Object.keys(this.userData).length);
      this.$eventBus.emit("userSession", { logged: this.logged });
    },
    logout() {
      sessionStorage.clear();
      this.checkAuth();
      this.redirectToHome();
    },
    redirectToHome() {
      this.logoutMsg = "Session closed. Redirecting in 5s...";
      let countdown = 5;
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        this.logoutMsg = `Session closed. Redirecting in ${countdown}s...`;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          this.$router.push("/");
        }
      }, 1000);
    },
  },
};
</script>
