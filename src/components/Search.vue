<template>
  <div
    ref="term-cont"
    class="term-cont term-cont-fullscreen"
    @keydown.tab.exact.prevent="setIsSearch(false)"
    @keydown.esc.exact.prevent="setIsSearch(false)"
    @keydown.ctrl.67.exact.prevent="sigint">
    <div
      class="term-search-container">
      <span class="term-search">
        (reverse-i-search)`<input
          ref="input"
          v-model="search"
          autofocus
          type="text"
          autocorrect="off"
          autocapitalize="none"
          @keyup.enter.exact="handle"/>': {{ command }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['setStdin'],

  props: {
    executed: {
      required: true,
      type: Set
    },

    // Indicates if search is visible
    isSearch: {
      required: true,
      type: Boolean
    },

    // Current Stdin
    stdin: {
      required: true,
      type: String
    }
  },

  data: () => ({
    // Suggested command
    command: '',
    // Users input
    search: ''
  }),

  watch: {
    search () {
      // Search in executed commands
      this.executed.forEach(executed => {
        if (executed.startsWith(this.search)) {
          this.command = executed
          // Set the new Stdin
          this.setStdin(executed)
        }
      })
    }
  },

  created () {
    this.command = this.stdin
  },

  mounted () {
    // Force autofocus
    this.focus()

    // Resize input about characters
    function resize () {
      this.style.width = `${this.value.length}ch`
    }
    const input = this.$refs.input
    input.addEventListener('input', resize)

    resize.call(input)
  },

  methods: {
    handle () {
      this.$emit('update:isSearch', false)
      // Request to handle the current search
      this.$emit('handle', this.command)
    },

    focus () {
      this.$refs.input.focus()
    },

    setIsSearch (isSearch) {
      this.$emit('update:isSearch', isSearch)
    },

    // Terminate search after cancellation
    sigint () {
      this.setStdin('')
      this.$emit('update:isSearch', false)
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  .term-search-container {
    display: flex;
  }

  input,
  textarea {
    background: none;
    border: none;
    font-family: "Inconsolata", monospace;
    font-size: 1rem;
    outline: none;
    flex: 1;
    width: 100%;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .term-search {
    flex: 1;
    background: none;
    margin: 0;
    border: 0;
    color: inherit;
    font-family: inherit;
    font-size: 1rem;
  }

  .term-ps {
    margin-right: 0.5rem;
  }
}
</style>
