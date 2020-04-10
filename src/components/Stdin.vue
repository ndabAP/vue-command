<template>
  <div
    class="stdin-container">
    <span
      v-if="!hidePrompt"
      class="term-ps">
      {{ prompt }}
    </span>
    <span class="term-stdin">
      <input
        ref="input"
        v-model="command"
        :autofocus="isLast"
        :disabled="!isLast || isInProgress"
        :placeholder="placeholder"
        type="text"
        autocorrect="off"
        autocapitalize="none"
        @click="setCursor($refs.input.selectionStart)"
        @keyup="setCursor($refs.input.selectionStart)"
        @keyup.enter="handle"/>
    </span>
  </div>
</template>

<script>
export default {
  inject: ['setCurrent', 'setCursor'],

  props: {
    bus: {
      required: true,
      type: Object
    },

    current: {
      type: String
    },

    helpText: {
      type: String
    },

    helpTimeout: {
      type: Number
    },

    hidePrompt: {
      default: false,
      type: Boolean
    },

    isInProgress: {
      default: false,
      type: Boolean
    },

    isLast: {
      required: true,
      type: Boolean
    },

    isFullscreen: {
      required: true,
      type: Boolean
    },

    prompt: {
      type: String
    },

    showHelp: {
      default: false,
      type: Boolean
    },

    uid: {
      required: true,
      type: Number
    }
  },

  data: () => ({
    command: '',
    // For virtual path simulation
    localPrompt: '',
    placeholder: ''
  }),

  watch: {
    current () {
      if (this.isLast) {
        this.setCommand(this.current)
      }
    },

    command () {
      // Emit current command as event
      this.setCurrent(this.command)
      // Emit current cursor position
      this.setCursor(this.$refs.input.selectionStart)
    },

    async isInProgress () {
      if (!this.isInProgress && this.isLast) {
        await this.$nextTick()

        this.scrollIntoView()
        this.focus()
      }

      if (this.isInProgress && !this.isLast) {
        this.blur()
      }
    },

    isLast (isLast, wasLast) {
      if (wasLast && !isLast) {
      // Allow components to get into focus
        this.blur()
      }
    }
  },

  created () {
    setTimeout(() => {
      if (this.isLast && this.showHelp) {
        this.setPlaceholder(this.helpText)
      }
    }, this.helpTimeout)
  },

  mounted () {
    // Scroll to current input and focus it
    this.scrollIntoView()
    this.focus()

    this.bus.$on('autocomplete', ({ command, uid }) => {
      if (this.isLast && this.uid === uid) {
        this.setCommand(command)
      }
    })
  },

  methods: {
    // Handle current command
    handle () {
      // Persist the current prompt
      this.setLocalPrompt(this.prompt)
      // Request to handle the current command
      this.$emit('handle', this.command)
      // Hide the current placeholder
      this.setPlaceholder('')
    },

    setPlaceholder (placeholder) {
      this.placeholder = placeholder
    },

    setCommand (command) {
      this.command = command
    },

    setLocalPrompt (localPrompt) {
      this.localPrompt = localPrompt
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
  .stdin-container {
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
    margin-left: 0.5rem;
    border: 0;
    color: inherit;
    font-family: inherit;
    font-size: 1rem;
  }
}
</style>
