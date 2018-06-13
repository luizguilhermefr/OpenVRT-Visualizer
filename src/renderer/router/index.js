import Vue from 'vue'
import Router from 'vue-router'

import LandingPage from '../components/LandingPage'
import Visualizer from '../components/Visualizer'
import About from '../components/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/visualizer',
      name: 'visualizer',
      component: Visualizer
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})
