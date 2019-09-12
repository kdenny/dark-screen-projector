<template>
  <div id="app">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <router-view/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
  @font-face {
    font-family: "Graphik";
    src: url('./assets/Graphik-Regular.otf');
  }
  $graphik: 'Graphik', sans-serif;
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: 'Graphik', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 110vh;
  width: 110vw;
  margin-left: -20px;
  margin-top: -20px;
  background-color: black;
}
</style>
