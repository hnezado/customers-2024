<template>
  <div v-if="!noResponse" class="main-container">
    <div id="catalog">
      <div v-for="prod in productsData" :key="prod.id" class="prod-card">
        <div class="prod-card-frm-img">
          <img :src="getImgsPath(prod)" :alt="prod.name" />
          <!-- <img :src="prod.main_img" :alt="prod.name" /> -->
        </div>
        <div class="prod-card-frm-data">
          <h3>{{ prod.name }}</h3>
          <div class="prod-card-frm-data-cat-container">
            <span
              v-for="(category, index) in prod.categories.split(',')"
              :key="index"
              class="prod-card-cat"
              >{{ category.trim() }}</span
            >
          </div>
          <p>
            <strong>{{ prod.manufacturer }}</strong>
            {{ prod.model }}
          </p>
          <h2>{{ prod.price }}€</h2>
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
    }, 2000);
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
    getImgsPath(prod) {
      const manufacturer = prod.manufacturer.toLowerCase().replace(/ /g, "-");
      const model = prod.model.toLowerCase().replace(/ /g, "-");
      const prodName = `${manufacturer}_${model}`;
      return `/media/products/${prodName}/${prodName}.webp`;
    },
  },
};
</script>
