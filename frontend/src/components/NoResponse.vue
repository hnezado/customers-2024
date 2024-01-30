<template>
    <div v-if="noResponse">
        <h4>Data retrieval failed</h4>
        <p>Path: <em>{{ path }}</em></p>
        <p>Component: <em>{{ pageName }}</em></p>
        <a @click="refreshPage">Refresh</a>
    </div>
</template>
  
<script>
export default {
    name: "NoResponsePage",
    props: {
        noResponse: Boolean,
        pageName: String,
        path: String
    },
    methods: {
        refreshPage() {
            if (typeof window !== 'undefined') {
                window.location.reload();
            } else {
                console.error('The page cannot refresh');
            }
        },
    }
};
</script>
