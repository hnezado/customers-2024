<template>
  <div class="main-container">
    <section class="section-card">
      <h1>Sign up</h1>
      <hr />
      <div class="signup">
        <form @submit.prevent="signup">
          <div class="input-groups">
            <div class="input-pair">
              <label for="email">Email:</label>
              <input type="text" id="email" v-model="newUser.email" required />
            </div>
            <div class="input-pair">
              <label for="username">Username:</label>
              <input
                type="text"
                id="username"
                v-model="newUser.username"
                required
              />
            </div>
            <div class="input-pair">
              <label for="password1">Password:</label>
              <input
                type="password"
                id="password1"
                v-model="newUser.password1"
                required
              />
            </div>
            <div class="input-pair">
              <label for="password2">Re-enter password:</label>
              <input
                type="password"
                id="password2"
                v-model="newUser.password2"
                required
              />
            </div>
          </div>
          <p class="infoMsg">{{ infoMsg }}</p>
          <button class="button" type="submit">Sign up</button>
        </form>
        <br />
        <span><a href="/login" class="link">Login</a> instead?</span>
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
        password1: "",
        password2: "",
      },
      infoMsg: "",
    };
  },
  mounted() {
    const logged = this.checkSession();
    if (logged) {
      this.$router.push("/profile");
    }
    this.$nextTick(() => {
      const focusedInput = this.$el.querySelector("#email");
      if (focusedInput) {
        focusedInput.focus();
      }
    });
  },
  methods: {
    checkSession() {
      const userData = sessionStorage.getItem("userData") || {};
      const logged = Boolean(Object.keys(userData).length);
      return logged;
    },
    isValidData() {
      if (this.newUser.password1 === this.newUser.password2) {
        return true;
      } else {
        this.infoMsg = "Password does not match";
        return false;
      }
    },
    async signup() {
      if (this.isValidData()) {
        try {
          const newUserData = {
            email: this.newUser.email,
            username: this.newUser.username,
            password: this.newUser.password1,
          };
          const res = await fetch(`${this.$config.serverUrl}/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUserData),
          });
          const parsedRes = await res.json();
          this.infoMsg = parsedRes.message;
          if (res.ok) {
            sessionStorage.setItem("signupUsername", parsedRes.data.username);
            this.$router.push("/login");
          } else {
            console.error("Error signing up");
          }
        } catch (error) {
          console.error("Error querying signup");
        }
      }
    },
  },
};
</script>
