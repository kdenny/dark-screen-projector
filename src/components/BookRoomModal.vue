<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              What time would you like to book {{ room.name }}?
            </slot>
          </div>

          <div class="modal-body">
            <div v-if="listening" class="listen-body">
              I'm listening...
            </div>
            <div v-if="booking.start">
              <div class="command">
                Book from {{ booking.start }} to {{ booking.end }} on {{ booking.date }}?
              </div>
              <div class="instruct">
                Speak "confirm" to submit your booking
              </div>
            </div>
          </div>

          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable */
  import * as d3 from 'd3'
export default {
  name: 'HelloWorld',
  props: ['room'],
  data () {
    return {
      rawSchedule: null,
      transcription: [],
      listening: false,
      booking: {
        roomId: null,
        start: null,
        end: null,
        date: null
      },
      confirm_screen: false
    }
  },
  mounted: function() {
    var me = this
    this.listen()
    setTimeout(function(){
      if (!me.booking.start) {
        this.$emit('close')
      }
    }, 30000);
  },
  methods: {
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
          if (!this.confirm_screen) {
            if (this.runtimeTranscription !== '') {
              if (this.runtimeTranscription.includes("close")) {
                this.$emit('close')
              } else {
                me.parseTime(this.runtimeTranscription)
              }
            } else {
              me.listen()
            }
          } else {
            if (this.runtimeTranscription !== '') {
              let llt = this.runtimeTranscription.replace("concern","confirm")
              if (this.runtimeTranscription.includes("confirm")) {
                console.log(this.booking)
                this.$emit('close')
              }
              if (this.runtimeTranscription.includes("close")) {
                this.$emit('close')
              }
            } else {
              me.listen()
            }
          }
          this.runtimeTranscription = ''
        }
      })
      me.recognition.start()
    },
    parseTime (text) {
      let timeFormat = d3.timeFormat("%I:%M %p")
      let dateFormat = d3.timeFormat("%Y-%m-%d")
      let nt = text.replace("p.m.","PM").replace("pm","PM").replace("P.M.","PM").replace("P.m.","PM").replace("a.m.","AM").replace("am","AM").replace("A.M.","AM").replace("A.m.","AM")
      console.log(nt)
      if (nt.includes("PM") || nt.includes("AM")) {
        this.booking.start = nt
        let today = new Date()
        today = today.setHours(0,0,0,0)
        let num = parseInt(text.split(" ")[0])
        if (nt.includes("PM")) {
          this.booking.rawStart = d3.timeHour.offset(today, num+12)
        } else {
          this.booking.rawStart = d3.timeHour.offset(today, num)
        }
        this.booking.rawEnd = d3.timeHour.offset(this.booking.rawStart, 1)
        this.booking.start = timeFormat(this.booking.rawStart)
        this.booking.end = timeFormat(this.booking.rawEnd)
        this.booking.date = dateFormat(this.booking.rawStart)
        console.log(this.booking)
        this.confirm_screen = true
        this.listen()
        setTimeout(function(){
          me.$emit('close')
        }, 60000);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    height: 60vh;
    width: 60vw;
  }

  .modal-container {
    height: 60vh;
    width: 60vw;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: 'Graphik', sans-serif;
    color: black;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .listen-body {

  }
</style>
