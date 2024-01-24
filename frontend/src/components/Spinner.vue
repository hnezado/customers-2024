<template>
    <div v-if="isLoading" class="spinner-overlay">
        <div class="spinner"></div>
        <p>Loading...</p>
    </div>
</template>
  
<script>
import "@/assets/styles.css"

export default {
    name: "LoaderSpinner",
    props: {
        isLoading: Boolean,
    }
};
</script>
