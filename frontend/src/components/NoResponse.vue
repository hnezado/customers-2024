<template>
  <div v-if="status" class="main-container">
    <div>
      <h2>No response</h2>
      <div class="info">
        <p>
          Path: <em>{{ path }}</em>
        </p>
        <p>
          Component: <em>{{ pageName }}</em>
        </p>
        <br />
        <a @click="refreshPage" class="link">Refresh</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoResponsePage",
  props: {
    responseData: Object,
  },
  data() {
    return {
      status: false,
      pageName: "",
      path: "",
    };
  },
  mounted() {
    this.updateData(this.responseData);
  },
  methods: {
    updateData(newData) {
      this.status = newData.status;
      this.pageName = newData.pageName;
      this.path = newData.path;
    },
    refreshPage() {
      if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.error("The page cannot refresh");
      }
    },
  },
  watch: {
    responseData: {
      handler(newData) {
        this.updateData(newData);
      },
    },
  },
};
</script>
