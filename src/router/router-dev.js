import Vue from 'vue'
import Router from 'vue-router'
import RoomsList from '../components/RoomsList'
import ConferenceRoomSchedule from '../components/ConferenceRoomSchedule'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: RoomsList
    },
    {
      path: '/room',
      name: 'room detail',
      component: ConferenceRoomSchedule
    }
  ]
})
