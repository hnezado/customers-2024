<template>
    <div>
      <h1>Soy TestOne</h1>
    </div>
</template>

<script>
import axios from 'axios'
  export default {
    mounted() {
        axios.get('http://192.168.1.10:8084')
        .then(res => {
            console.log(res.data)
        })
        .catch(error => {
            console.error('Error al llamar al backend', error)
        })
    }
  }
</script>
