<template>
  <div class="main-container">
    <div id="home">
      <h1>EcoBr🔩co</h1>
      <h4>Welcome to your DIY center</h4>
      <div class="welcome-card">
        <div @click="signup" class="button">Sign Up</div>
        <span
          >If you already have an account,
          <a href="/login" class="link">login</a>.</span
        >
      </div>
      <br />
      <hr />
      <br />
      <section>
        <strong
          >Your one-stop destination for all your home improvement
          needs.</strong
        >
      </section>
      <br />
      <section>
        <h3>Explore Our Categories</h3>
        <p>
          Discover a wide range of tools, materials, and accessories to tackle
          any DIY project. From woodworking to plumbing, we've got you covered.
        </p>
      </section>
      <br />
      <section>
        <h3>Featured Products</h3>
        <p>
          Check out our curated selection of top-quality products, handpicked to
          inspire your next project. Find the tools and materials you need to
          bring your ideas to life.
        </p>
      </section>
      <br />
      <section>
        <h3>Expert Advice and Guides</h3>
        <p>
          Whether you're a seasoned DIY enthusiast or just getting started, our
          expert guides and tips will help you navigate through your projects
          with confidence. Learn new techniques and stay informed about the
          latest trends in home improvement.
        </p>
      </section>
      <br />
      <section>
        <h3>Join Our DIY Community</h3>
        <p>
          Connect with like-minded DIYers in our community forums. Share your
          projects, ask questions, and get advice from experienced DIY
          enthusiasts. Together, we can build and create amazing things.
        </p>
      </section>
      <br />
      <br />
      <h3 style="font-style: italic">
        Start your next DIY adventure with Your DIY Store. Empowering you to
        make your home uniquely yours.
      </h3>
    </div>
  </div>
</template>

<script>
import "@/styles/components/Home.css";

export default {
  name: "HomePage",
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
  },
  methods: {
    signup() {
      this.$router.push("/signup");
    },
  },
};
</script>
