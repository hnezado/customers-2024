<template>
  <HeaderMenu />
  <router-view :customersData="customersData" />
  <hr />
</template>

<script>
import HeaderMenu from "@/components/HeaderMenu.vue";

export default {
  name: "App",
  components: {
    HeaderMenu,
  },
  data() {
    return {
      customersData: [],
      serverUrl: "",
    };
  },
  mounted() {
    this.fetchCustomersData();
  },
  methods: {
    async fetchCustomersData() {
      try {
        const response = await fetch(this.$config.serverUrl);
        const data = await response.json();
        console.log("res data:", data);
        this.customersData = data;
      } catch (error) {
        console.error("Error fetching data from server", error);
      }
    },
  },
};
</script>

<style>
@import "./assets/styles.css";
</style>
