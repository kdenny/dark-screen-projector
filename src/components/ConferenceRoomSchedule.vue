<template>
  <div class="full">
    <div class="calendar-title">Schedule for {{ room.name }} <span v-if="listening">**</span></div>
    <div v-if="schedule" class="schedule">
      <div v-for="day in days" v-bind:key="day" class="day-row">
        <div class="day-title">
          {{ day }}
        </div>
        <div class="day-events">
          <div class="event-row" v-for="event in schedule[day]" v-bind:key="event.cal_id">
            <div class="event-record">
              <div class="event-times">
                <div class="start-time">
                  {{ event.start_time }} -
                </div>
                <div class="end-time">
                  {{ event.end_time }}
                </div>
              </div>
              <div class="event-name">
                <div class="event-title">
                  {{ event.summary }}
                </div>
                <div class="organizer">
                  {{ event.organizer.email }} and {{ event.attendees.length - 1}} others
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div v-if="!schedule" class="schedule">
      Loading room schedule...
    </div>
    <book_room v-if="booking" :room="room" v-on:close="booking = false"></book_room>

  </div>
</template>

<script>
  /* eslint-disable */
  import * as d3 from 'd3'
  import BookRoomModal from './BookRoomModal.vue'
export default {
  name: 'ConferenceRoomSchedule',
  props: [],
  components: {
    book_room: BookRoomModal
  },
  data () {
    return {
      rawSchedule: null,
      transcription: [],
      listening: false,
      room: null,
      booking: false,
      rd: {
        'tinypass.com_393837353833373831@resource.calendar.google.com': {
          name: 'Large Conference Room',
          key: 'tinypass.com_393837353833373831@resource.calendar.google.com'
        },
        'tinypass.com_343739343839323532@resource.calendar.google.com': {
          name: 'Small Conference Room',
          key: 'tinypass.com_343739343839323532@resource.calendar.google.com'
        }
      }
    }
  },
  mounted: function() {
    var me = this
    let room = this.$route.query.room
    console.log(room)
    if (room) {
      this.room = this.rd[room]
      this.getRoomSchedule()
      this.listen()
    }
    setTimeout(function(){
      me.getRoomSchedule();
      me.listen();
      }, 30000);
    this.booking = false
  },
  methods: {
    getRoomSchedule () {
      var me = this
      this.rawSchedule = null
      let u = 'https://pnfv2.piano.io/ops/calendar/?room=' + this.room.key
      this.$http.get(u).then(resp => {
        me.rawSchedule = resp.data
        console.log(me.rawSchedule)
      })
    },
    listen () {
      var me = this
      this.listening = true
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition && process.env.NODE_ENV !== 'production') {
        throw new Error('Speech Recognition does not exist on this browser. Use Chrome or Firefox')
      }
      if (!SpeechRecognition) {
        console.log("Speech failed :(")
        return
      }
      console.log("Starting listening")
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'en-US'
      this.recognition.interimResults = true
      this.recognition.addEventListener('result', event => {
        const text = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
        console.log(text)
        me.runtimeTranscription = text
      })

      this.recognition.addEventListener('end', () => {
        if (this.runtimeTranscription) {
          console.log(this.runtimeTranscription)
          if (this.runtimeTranscription !== '') {
            if ((this.runtimeTranscription.includes('book') && this.runtimeTranscription.includes('room')) || ((this.runtimeTranscription.includes('conference')) && (this.runtimeTranscription.includes('room')))) {
              this.listening = false
              me.openBooking()
            }
            this.transcription.push(this.runtimeTranscription)
            console.log(this.transcription)
          }
          this.runtimeTranscription = ''
        }
      })
      me.recognition.start()
    },
    openBooking () {
      this.booking = true
    }
  },
  computed: {
    days () {
      if (this.schedule) {
        return Object.keys(this.schedule)
      } else {
        return null
      }
    },
    schedule () {
      let timeParse = d3.timeParse("%Y-%m-%dT%H:%M:%S")
      let timeFormat = d3.timeFormat("%I:%M %p")
      let dateFormat = d3.timeFormat("%Y-%m-%d")
      if (this.rawSchedule) {
        let g = this.rawSchedule.data
        console.log(g)
        let h = g.map(ev => {
          console.log(ev.end)
          let st = ev.start.split("-07:")[0]
          let et = ev.end.split("-07:")[0]
          let s = timeParse(st)
          let e = timeParse(et)
          ev.start = s
          ev.start_time = timeFormat(d3.timeHour.offset(s, 3))
          ev.start_date = dateFormat(s)
          ev.end = e
          ev.end_time = timeFormat(d3.timeHour.offset(e, 3))
          ev.end_date = dateFormat(e)
          ev.end = e
          return ev
        })

        let dates = {}

        h.forEach(ev => {
          if (!dates[ev.start_date]) {
            dates[ev.start_date] = [ev]
          } else {
            dates[ev.start_date].push(ev)
          }
        })

        let alldays = Object.keys(dates)
        alldays.forEach(d => {
          dates[d] = dates[d].sort(function (x,y) {
            return d3.ascending(x.start_time, y.start_time)
          })
        })

        return dates
      } else {
        return null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .full {
    background-color: black;
    width: 100%;
    height: 1000%;
    color: white;
    font-size: 24pt;
  }
  .calendar-title {
    position: absolute;
    left: 25vw;
    top: 5vh;
  }
  .lower-text {
    text-align: center;
    font-size: 12pt;
  }
  .lower-box {
    margin-top: 50vh;
  }
  .schedule {
    position: absolute;
    left: 25vw;
    top: 15vh;
    font-size: 18pt;
  }
  .day-title {
    height: 40px;
    font-size: 22pt;
    padding-bottom: 10px;
  }
  .day-row {
    text-align: left;
    padding-bottom: 50px;
  }
  .day-events {
  }
  .event-row {
    padding-bottom: 20px;
  }
  .event-times {
    width: 15vw;
    display: inline-block;
    vertical-align: top;
  }
  .event-name {
    display: inline-block;
  }
  .event-record {
    display: inline-block;
  }
  .organizer {
    font-size: 14pt;
    padding-top: 5px;
  }
</style>
