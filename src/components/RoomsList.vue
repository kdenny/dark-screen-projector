<template>
  <div class="full">
    <div class="title">
      Please select a conference room
    </div>
    <div class="center">
      <div v-for="ro in rooms[currentOffice]" v-bind:key="ro.name" class="room-item" v-on:click="selectRoom(ro)">
        {{ ro.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      rawSchedule: null,
      transcription: [],
      listening: false,
      rooms: {
        PHL: [
          {
            name: 'PHL Large Conference Room',
            key: 'tinypass.com_393837353833373831@resource.calendar.google.com'
          },
          {
            name: 'PHL Small Conference Room',
            key: 'tinypass.com_343739343839323532@resource.calendar.google.com'
          }
        ]
      },
      currentOffice: 'PHL'
    }
  },
  mounted: function() {
  },
  methods: {
    selectRoom (ro) {
      this.$router.push({ path: 'room', query: { room: ro.key } })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
  .full {
    background-color: black;
    width: 110vh;
    height: 110vw;
    color: white;
    font-size: 24pt;
  }
  .center {
    position: absolute;
    top: 25vh;
    left: 35vw;
    height: 80vh;
  }
  .title {
    position: absolute;
    top: 5vh;
    left: 33vw;
    margin-top: 20px;
  }
  .room-item {
    height: 15vh;
    cursor: pointer;
  }

</style>
