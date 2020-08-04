<template>
  <div
    class="term-stdin-container">

    <slot name="prompt">
      <span
        v-if="!hidePrompt"
        class="term-ps">
        {{ local.prompt }}
      </span>
    </slot>

    <span class="term-stdin">
      <input
        ref="input"
        v-model="local.stdin"
        :autofocus="isLast"
        :disabled="!isLast || isInProgress"
        :placeholder="placeholder"
        type="text"
        autocorrect="off"
        autocapitalize="none"
        @click="setCursor($refs.input.selectionStart)"
        @keyup="setCursor($refs.input.selectionStart)"
        @keyup.enter.exact="handle"/>
    </span>
  </div>
</template>

<script>
export default {
  inject: ['setCursor', 'setStdin'],

  props: {
    bus: {
      required: true,
      type: Object
    },

    cursor: {
      default: 0,
      required: true,
      type: Number
    },

    helpText: {
      default: '',
      type: String
    },

    helpTimeout: {
      default: 0,
      type: Number
    },

    hidePrompt: {
      default: false,
      type: Boolean
    },

    isInProgress: {
      default: false,
      required: true,
      type: Boolean
    },

    isLast: {
      default: false,
      required: true,
      type: Boolean
    },

    isFullscreen: {
      default: false,
      required: true,
      type: Boolean
    },

    prompt: {
      default: '',
      type: String
    },

    showHelp: {
      default: false,
      type: Boolean
    },

    stdin: {
      default: '',
      required: true,
      type: String
    },

    uid: {
      required: true,
      type: Number
    }
  },

  data: () => ({
    placeholder: '',
    local: {
      // This makes it possible to change the prompt during runtime
      prompt: '',
      stdin: ''
    }
  }),

  watch: {
    cursor () {
      if (this.isLast) {
        // Mirror the cursor position to the real cursor position
        this.$refs.input.setSelectionRange(this.cursor, this.cursor)
      }
    },

    async isInProgress () {
      if (!this.isInProgress && this.isLast) {
        await this.$nextTick()

        this.scrollIntoView()
        this.focus()
      }
    },

    isLast (isLast, wasLast) {
      if (wasLast && !isLast) {
        // Allow components to get into focus
        this.blur()
      }
    },

    async stdin () {
      // Only last Stdin is allowed to mutate
      if (this.isLast && !this.isInProgress) {
        this.local.stdin = this.stdin
      }

      await this.$nextTick()
      // Set current cursor position
      this.setCursor(this.$refs.input.selectionStart)
    },

    'local.stdin' () {
      // Set current Stdin
      this.$emit('update:stdin', this.local.stdin)
      // Set current cursor position
      this.setCursor(this.$refs.input.selectionStart)
    }
  },

  created () {
    this.local.prompt = this.prompt
    this.local.stdin = this.stdin
  },

  mounted () {
    // Scroll to current input
    this.scrollIntoView()
    // Focus new Stdin
    this.focus()

    setTimeout(() => {
      if (this.isLast && this.showHelp) {
        this.setPlaceholder(this.helpText)
      }
    }, this.helpTimeout)
  },

  methods: {
    // Handle current command
    handle () {
      // Persist the current prompt
      this.setPrompt(this.prompt)
      // Request to handle the current Stdin
      this.$emit('handle', this.local.stdin)
      // Hide the current placeholder
      this.setPlaceholder('')
    },

    setPlaceholder (placeholder) {
      this.placeholder = placeholder
    },

    setPrompt (promt) {
      this.local.prompt = promt
    },

    blur () {
      this.$refs.input.blur()
    },

    focus () {
      this.$refs.input.focus()
    },

    scrollIntoView () {
      this.$refs.input.scrollIntoView()
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  .term-stdin-container {
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

  .term-stdin {
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
