<template>
  <div>
    <span v-if="!isLoading && !isError">{{ joke }}</span>
    <span v-if="isLoading && !isError">Loading ...</span>
    <span v-if="isError">There was an error getting the joke</span>
  </div>
</template>

<script>
const API_URL = 'https://api.chucknorris.io/jokes/random'
const API_TIMEOUT = 5000 // 5 seconds

const abortController = new AbortController()

export default {
  inject: ['terminate'],

  data: () => ({
    isError: false,
    isLoading: true,
    joke: ''
  }),

  async mounted () {
    // Abort getting joke when API request takes longer than defined in "API_TIMEOUT"
    setTimeout(() => {
      if (this.isLoading) {
        abortController.abort()
      }
    }, API_TIMEOUT)

    try {
      const response = await fetch(API_URL, { signal: abortController.signal })
      if (!response.ok) {
        this.setIsError(true)
        this.terminate()

        return
      }

      const { value } = await response.json()
      this.joke = value
    } catch (error) {
      this.setIsError(true)
    } finally {
      this.isLoading = false
      this.terminate()
    }
  },

  methods: {
    setIsError (isError) {
      this.isError = isError
    }
  }
}
</script>
