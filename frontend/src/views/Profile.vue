<template>
  <div v-if="!noResponse" class="main-container">
    <div v-if="session.logged" class="profile">
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
            <tr v-for="(value, key) in session.userData" :key="key">
              <td>{{ key }}</td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <button class="button" @click="logout">Log out</button>
    </div>
    <div v-else class="info">
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
      session: {},
      noResponse: false,
      isLoading: true,
      pageName: this.$options.name,
      path: this.$route.path,
      logoutMsg: "",
    };
  },
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
    this.$eventBus.on("session", this.handleSession);
    const [userData, logged] = this.checkSession();
    if (logged) {
      this.updateSession(userData, logged);
    } else {
      this.$router.push("/login");
    }
  },
  beforeUnmount() {
    this.$eventBus.off("session", this.handleSession);
  },
  methods: {
    handleSession(status) {
      if (!status.logged) {
        this.$router.push("/login");
      }
    },
    checkSession() {
      const userData = sessionStorage.getItem("userData") || {};
      const logged = Boolean(Object.keys(userData).length);
      return [JSON.parse(userData), logged];
    },
    updateSession(userData, logged) {
      this.session.userData = userData;
      this.session.logged = logged;
    },
    // updateSession(...args) {
    //   // This method must be called with call() to assign argument values dynamically
    //   // depending on what data is wanted to be saved on the component data (this)
    //   // Ex: this.updateSession.call(this, "var1", "var2") will assign:
    //   // this.session.var1 = "var1"
    //   // this.session.var2 = "var2"
    //   for (let i = 0; i < args.length; i++) {
    //     this[args[i]] = args[i];
    //   }
    // },
    logout() {
      sessionStorage.clear();
      this.session.logged = false;
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
          this.$eventBus.emit("session", { logged: false });
        }
      }, 1000);
    },
  },
};
</script>
