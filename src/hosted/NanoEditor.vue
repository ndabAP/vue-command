<template>
  <div>
    <textarea
      ref="nano"
      @keydown.ctrl.88="terminate">This is a text editor! Press Ctrl + X to leave.</textarea>
  </div>
</template>

<script>
import Vuex from 'vuex'
import Vue from 'vue'

import store from '../store/index'

Vue.use(Vuex)

export default {
  inject: ['setIsFullscreen', 'terminate'],

  store: new Vuex.Store({
    modules: {
      terminal: store
    }
  }),

  computed: {
    isInProgress: {
      get () {
        return this.$store.state.terminal.isInProgress
      }
    }
  },

  mounted () {
    this.setIsFullscreen(true)
    this.$refs.nano.focus()
  }
}
</script>

<style lang="scss" scoped>
div,
textarea {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
