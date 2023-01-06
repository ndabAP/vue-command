<template>
  <div>
    <span v-if="!isLoading && !isError">{{ joke }}</span>
    <span v-if="isLoading && !isError">{{ loadingText }}</span>
    <span v-if="isError">There was an error getting the joke</span>
  </div>
</template>

<script lang="js">
const API_URL = 'https://api.chucknorris.io/jokes/random'

export default {
  inject: ['exit', 'signals'],

  data: () => ({
    isError: false,
    isLoading: true,
    joke: '',
    loadingText: 'Loading ...'
  }),

  async mounted () {
    const abortController = new AbortController()

    const sigint = () => {
      abortController.abort()
      this.signals.off('SIGINT')
    }
    this.signals.on('SIGINT', sigint)

    try {
      const response = await fetch(API_URL, { signal: abortController.signal })
      this.signals.off('SIGINT', sigint)
      if (!response.ok) {
        this.isLoading = false
        this.isError = true
        this.exit()
        return
      }

      const { value } = await response.json()
      this.joke = value
      this.isLoading = false
    } catch (error) {
      if (error.name === 'AbortError') {
        // Simulate SIGINT
        this.loadingText = `${this.loadingText}^C`
      } else {
        this.isError = true
        this.isLoading = false
      }
    } finally {
      this.exit()
    }
  }
}
</script>
