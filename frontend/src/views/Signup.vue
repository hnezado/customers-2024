<template>
  <h1>Signup</h1>
  <div class="signup">
    <form @submit.prevent="signup">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="newUser.username" required />
      <label for="email">Email:</label>
      <input type="text" id="email" v-model="newUser.email" required />
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="newUser.password"
        required
      />
      <button class="button" type="submit">Signup</button>
    </form>
  </div>
</template>

<script>
import "@/styles/components/Signup.css";

export default {
  name: "SignupPage",
  data() {
    return {
      newUser: {
        username: "",
        email: "",
        password: "",
      },
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
        if (res.ok) {
          const data = await res.json();
          console.log(data.message);
          console.log(data.username);
          sessionStorage.setItem("username", data.username);
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
