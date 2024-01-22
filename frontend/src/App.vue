<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <TestOne/>
  <hr>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import TestOne from './components/TestOne.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    TestOne,
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
