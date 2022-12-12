// @vue/component
export default {
  provide () {
    return {
      setIsFullscreen: this.setIsFullscreen,
      setIsInProgress: this.setIsInProgress
    }
  },

  data: () => ({
    local: {
      // Run command in fullscreen
      isFullscreen: false,
      // Indicates if a command is in progress
      isInProgress: false
    }
  }),

  watch: {
    isFullscreen () {
      this.setIsFullscreen(this.isFullscreen)
    },

    isInProgress () {
      this.setIsInProgress(this.isInProgress)
    },

    'local.isFullscreen' () {
      this.$emit('update:isFullscreen', this.local.isFullscreen)
    },

    'local.isInProgress' () {
      this.$emit('update:isInProgress', this.local.isInProgress)
    }
  },

  methods: {
    setIsFullscreen (isFullscreen) {
      this.local.isFullscreen = isFullscreen
    },

    setIsInProgress (isInProgress) {
      this.local.isInProgress = isInProgress
    }
  }
}
