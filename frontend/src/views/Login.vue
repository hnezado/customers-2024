<template>
  <h1>Login</h1>
  <div class="login">
    <span>{{ infoMsg }}</span>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="userData.username" required />
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="userData.password"
        required
      />
      <button class="button" type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import "@/styles/components/Login.css";

export default {
  name: "LoginPage",
  data() {
    return {
      userData: {
        username: "",
        password: "",
      },
      infoMsg: "",
    };
  },
  mounted() {
    const usernameFromSignup = sessionStorage.getItem("usernameFromSignup");
    if (usernameFromSignup) {
      this.userData.username = usernameFromSignup;
    }
  },
  methods: {
    async login() {
      try {
        const res = await fetch(`${this.$config.serverUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.userData),
        });
        if (res.ok) {
          const parsedRes = await res.json();
          this.infoMsg = parsedRes.message;
          sessionStorage.setItem("userData", JSON.stringify(parsedRes.data));
          this.$router.push("/profile");
        } else {
          console.error("Error logging in");
        }
      } catch (error) {
        console.error("Error querying login");
      }
    },
  },
};
</script>
