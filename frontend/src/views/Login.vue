<template>
  <div class="main-container">
    <section class="section-card">
      <h1>Login</h1>
      <hr />
      <div class="login">
        <span>{{ infoMsg }}</span>
        <form @submit.prevent="login">
          <div class="input-groups">
            <div class="input-pair">
              <label for="username">Username:</label>
              <input
                type="text"
                id="username"
                v-model="loginData.username"
                required
              />
            </div>
            <div class="input-pair">
              <label for="password">Password:</label>
              <input
                type="password"
                id="password"
                v-model="loginData.password"
                required
              />
            </div>
          </div>
          <button class="button" type="submit">Login</button>
        </form>
        <br />
        <span
          >You don't have an account?
          <a href="/signup" class="link">Sign up</a></span
        >
      </div>
    </section>
  </div>
</template>

<script>
import "@/styles/components/Login.css";

export default {
  name: "LoginPage",
  data() {
    return {
      loginData: {
        username: "",
        password: "",
      },
      infoMsg: "",
      noResponse: false,
    };
  },
  mounted() {
    const logged = this.checkSession();
    if (logged) {
      this.$router.push("/profile");
    } else {
      const signupUsername = sessionStorage.getItem("signupUsername");
      this.loginData.username = signupUsername ? signupUsername : "";
      console.log("username:", this.loginData.username);
      console.log(Boolean(this.loginData.username));
      this.$nextTick(() => {
        const focusedInput = signupUsername
          ? this.$el.querySelector("#password")
          : this.$el.querySelector("#username");
        if (focusedInput) {
          focusedInput.focus();
        }
      });
    }
  },
  methods: {
    checkSession() {
      const userData = sessionStorage.getItem("userData") || {};
      const logged = Boolean(Object.keys(userData).length);
      return logged;
    },
    async login() {
      console.log("logging in");
      try {
        const res = await fetch(`${this.$config.serverUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.loginData),
        });
        if (res.ok) {
          const parsedRes = await res.json();
          this.infoMsg = parsedRes.message;
          sessionStorage.clear();
          sessionStorage.setItem("userData", JSON.stringify(parsedRes.data));
          this.$eventBus.emit("session", { logged: true });
          this.$router.push("/profile");
        } else {
          console.error("Error logging in from backend");
        }
      } catch (error) {
        console.error("No response");
        this.noResponse = true;
        this.$eventBus.emit("noResponse", {
          status: true,
          pageName: this.$options.name,
          path: this.$route.path,
        });
      }
    },
  },
};
</script>
