<template>
  <div class="full">
    <div class="calendar-title">Schedule for {{ room.name }}</div>
    <div v-if="schedule" class="schedule">
      <div v-for="day in days" v-bind:key="day" class="day-row">
        <div class="day-title">
          {{ day }}
        </div>
        <div class="day-events">
          <div class="event-row" v-for="event in schedule[day]" v-bind:key="event.cal_id">
            <div class="event-record">
              <div class="event-times">
                {{ event.start_time }} - {{ event.end_time }}
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

  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'ConferenceRoomSchedule',
  props: ['room'],
  data () {
    return {
      rawSchedule: null
    }
  },
  mounted: function() {
    this.getRoomSchedule()
  },
  methods: {
    getRoomSchedule () {
      var me = this
      let u = 'http://pnfv2.piano.io/ops/calendar/?room=' + this.room.key
      this.$http.get(u).then(resp => {
        me.rawSchedule = resp.data
        console.log(me.rawSchedule)
      })
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
      let timeFormat = d3.timeFormat("%H:%M")
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
          ev.start_time = timeFormat(s)
          ev.start_date = dateFormat(s)
          ev.end = e
          ev.end_time = timeFormat(e)
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
    },

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
