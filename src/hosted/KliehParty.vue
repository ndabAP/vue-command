<template>
  <div>
    <span
      v-for="(char, i) in 'KLIEH'"
      :key="i"
      :style="{ color: color(i) }">
      {{ char }}
    </span>
  </div>
</template>

<script>
const colors = ['#FF0000', '#FF9900', '#CCFF00', '#33FF00', '#00FF66', '#00FFFF', '#0066FF', '#3300FF', '#CC00FF', '#FF0099']

export default {
  data: () => ({
    i: 0,
    interval: undefined
  }),

  mounted () {
    this.interval = setInterval(() => {
      this.i++
    }, 40)

    window.addEventListener('keydown', (e) => {
      if (e.key === 'c' && e.getModifierState('Control')) {
        this.finish()
      }
    }, true)
  },

  methods: {
    color (i) {
      i += this.i
      const offset = Math.floor(i / colors.length) * colors.length
      return colors[i - offset]
    },

    finish () {
      clearInterval(this.interval)
      this.$_done()
    }
  }
}
</script>
