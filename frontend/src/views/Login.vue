<template>
  <h1>Login</h1>
  <div class="login">
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
    };
  },
  mounted() {
    const usernameFromSignup = sessionStorage.getItem("username");
    console.log("usernameFromSignup:", usernameFromSignup);
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
          const data = await res.json();
          console.log(data.message);
          this.$router.push("/");
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
