<template>
  <div class="main-container">
    <div v-if="Object.keys(userData).length" class="profile">
      <h1>My Profile Data</h1>
      <div class="table-container">
        <table class="table">
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
    </div>
    <div v-if="!logged" class="info">
      <p>Session closed</p>
      <p>{{ logoutMsg }}</p>
    </div>
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
      this.logoutMsg = "Redirecting in 3s...";
      let countdown = 3;
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        this.logoutMsg = `Redirecting in ${countdown}s...`;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          this.$router.push("/");
        }
      }, 1000);
    },
  },
};
</script>
