<template>
  <div id="app">
    <h1>dream home</h1>
    <p>
      <router-link  to='/route-demo'>routeDemo</router-link>
      <router-link  to='/keyboard'>keyboard</router-link>
    </p>
    <router-view/>
  </div>
</template>

<script>
import 'flex.css'
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
