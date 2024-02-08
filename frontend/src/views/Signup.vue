<template>
  <div class="main-container">
    <section class="section-card">
      <h1>Signup</h1>
      <hr />
      <div class="signup">
        <span>{{ infoMsg }}</span>
        <form @submit.prevent="signup">
          <div class="input-group">
            <label for="email">Email:</label>
            <input type="text" id="email" v-model="newUser.email" required />
          </div>
          <div class="input-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              v-model="newUser.username"
              required
            />
          </div>
          <div class="input-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="newUser.password"
              required
            />
          </div>
          <button class="button" type="submit">Signup</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import "@/styles/components/Signup.css";

export default {
  name: "SignupPage",
  data() {
    return {
      newUser: {
        email: "",
        username: "",
        password: "",
      },
      infoMsg: "",
    };
  },
  methods: {
    async signup() {
      try {
        const res = await fetch(`${this.$config.serverUrl}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newUser),
        });
        const parsedRes = await res.json();
        this.infoMsg = parsedRes.message;
        if (res.ok) {
          sessionStorage.setItem("usernameFromSignup", parsedRes.data.username);
          this.$router.push("/login");
        } else {
          console.error("Error signing up");
        }
      } catch (error) {
        console.error("Error querying signup");
      }
    },
  },
};
</script>
