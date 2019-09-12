<template>
  <div id="app">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <conference_room :room="currentRoom"></conference_room>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import ConferenceRoomSchedule from './components/ConferenceRoomSchedule.vue'

export default {
  name: 'app',
  components: {
    conference_room: ConferenceRoomSchedule
  },
  data () {
    return {
      currentRoom: {
        name: 'Large Conference Room',
        key: 'tinypass.com_393837353833373831@resource.calendar.google.com'
      }
      // currentRoom: {
      //   name: 'Small Conference Room',
      //   key: 'tinypass.com_343739343839323532@resource.calendar.google.com'
      // }
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
