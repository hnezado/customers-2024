<template>
  <div class="title">
    <h1>Customers 2024</h1>
  </div>
  <section>
    <h2>Welcome!</h2>
    <div @click="signup" class="button">
      Sign Up
    </div>
    <span>If you already have an account, <a href="#">login</a>.</span>
  </section>
</template>

<script>
import "@/styles/components/Home.css"

export default {
  name: "HomePage",
  methods: {
    signup() {
      this.$router.push("/signup")
    }
  }
};
</script>
