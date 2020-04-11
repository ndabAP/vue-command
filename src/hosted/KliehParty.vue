<template>
  <div>
    <span
      v-for="(character, index) in characters"
      :key="index"
      :style="{ color: color(index) }">
      {{ character }}
    </span><br><br>
    Press Ctrl + C to leave.
  </div>
</template>

<script>
import { C_LOWER_KEY, CONTROL_KEY } from '../constants/keys'

const COLORS = [
  '#FF0000',
  '#FF9900',
  '#CCFF00',
  '#33FF00',
  '#00FF66',
  '#00FFFF',
  '#0066FF',
  '#3300FF',
  '#CC00FF',
  '#FF0099'
]
const INTERVAL_TIMEOUT = 40

export default {
  inject: ['terminate'],

  data: () => ({
    characters: 'KLIEH',
    index: 0,
    interval: undefined
  }),

  mounted () {
    this.interval = setInterval(() => {
      this.index++
    }, INTERVAL_TIMEOUT)

    window.addEventListener('keydown', event => {
      // Ctrl and C simultaneously
      if (event.key === C_LOWER_KEY && event.getModifierState(CONTROL_KEY)) {
        // Stop animation
        clearInterval(this.interval)

        this.terminate()
      }
    }, true)
  },

  methods: {
    // Returns color by given index
    color (index) {
      index += this.index
      const offset = Math.floor(index / COLORS.length) * COLORS.length

      return COLORS[index - offset]
    }
  }
}
</script>
