<template>
  <div v-if="!noResponse" class="main-container">
    <div class="products-container">
      <div
        v-for="product in productsData"
        :key="product.id"
        class="product-card"
      >
        <div class="product-card-frame-img">
          <img :src="product.main_img" :alt="product.name" />
        </div>
        <div class="product-card-frame-data">
          <h3>{{ product.name }}</h3>
          <!-- <p class="product-card-description">{{ product.description }}</p> -->
          <div class="product-card-categories-container">
            <span
              v-for="(category, index) in product.categories.split(',')"
              :key="index"
              class="product-card-category"
              >{{ category.trim() }}</span
            >
          </div>
          <p>
            <strong>{{ product.manufacturer }}</strong>
            {{ product.model }}
          </p>
          <h2>{{ product.price }}€</h2>
          <button class="button">View details</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/components/Catalog.css";

export default {
  name: "CatalogPage",
  data() {
    return {
      noResponse: false,
      productsData: null,
    };
  },
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
    this.$eventBus.emit("loading", { status: true });
    setTimeout(() => {
      this.fetchProductsData();
      this.$eventBus.emit("loading", { status: false });
    }, 5000);
  },
  beforeUnmount() {
    this.$eventBus.emit("loading", { status: false });
  },
  methods: {
    async fetchProductsData() {
      try {
        const res = await fetch(`${this.$config.serverUrl}/catalog`);
        // const res = await fetch(`${this.$config.serverUrl}/test`);
        const data = await res.json();
        if (Array.isArray(data)) {
          if (data.length > 0) this.productsData = data;
        } else {
          this.noResponse = true;
          this.$eventBus.emit("noResponse", {
            status: true,
            pageName: this.$options.name,
            path: this.$route.path,
          });
        }
      } catch (error) {
        console.error("Error fetching data from server", error);
      }
    },
  },
};
</script>
