<template>
  <div>
    <span
      v-for="(character, index) in 'KLIEH'"
      :key="index"
      :style="{ color: color(index) }">
      {{ character }}
    </span>
  </div>
</template>

<script>
const colors = [
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
  data: () => ({
    index: 0,
    interval: undefined
  }),

  mounted () {
    this.interval = setInterval(() => {
      this.index++
    }, INTERVAL_TIMEOUT)

    window.addEventListener('keydown', event => {
      if (event.key === 'c' && event.getModifierState('Control')) {
        clearInterval(this.interval)
        this.$_done()
      }
    }, true)
  },

  methods: {
    color (index) {
      index += this.index
      const offset = Math.floor(index / colors.length) * colors.length

      return colors[index - offset]
    }
  }
}
</script>
