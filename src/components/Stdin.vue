<template>
  <div
    v-show="!isFullscreen && (!isLast || !isInProgress)"
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
        @click="emitCursor"
        @keyup="emitCursor"
        @keyup.enter="handle"/>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    bus: {
      type: Object,
      required: true
    },

    helpText: {
      type: String
    },

    helpTimeout: {
      type: Number
    },

    hidePrompt: {
      type: Boolean,
      default: false
    },

    isInProgress: {
      type: Boolean,
      default: false
    },

    isLast: {
      type: Boolean,
      required: true
    },

    lastCommand: {
      type: String,
      default: ''
    },

    isFullscreen: {
      type: Boolean,
      required: true
    },

    prompt: {
      type: String
    },

    showHelp: {
      type: Boolean,
      default: false
    },

    uid: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    command: '',
    // For virtual path simulation
    localPrompt: '',
    placeholder: ''
  }),

  watch: {
    lastCommand () {
      if (this.lastCommand && this.isLast) {
        this.setCommand(this.lastCommand)
      }
    },

    command () {
      // Emit current command as event
      this.$emit('typing', this.command)
      // Emit current cursor position
      this.$emit('cursor', this.$refs.input.selectionStart)
    },

    async isInProgress () {
      if (!this.isInProgress && this.isLast) {
        await this.$nextTick()

        this.$refs.input.scrollIntoView()
        this.$refs.input.focus()
      }

      if (this.isInProgress && !this.isLast) {
        this.$refs.input.blur()
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
    this.$refs.input.scrollIntoView()
    this.$refs.input.focus()

    const onAutocomplete = ({ command, uid }) => {
      if (this.isLast && this.uid === uid) {
        this.setCommand(command)
      }
    }

    const onSetCommand = command => {
      if (this.isLast) {
        this.setCommand(command)
      }
    }

    this.bus.$on('autocomplete', onAutocomplete)
    this.bus.$on('setCommand', onSetCommand)
  },

  methods: {
    // Handle current command
    handle () {
      // Wait for other commands to finish
      if (this.isInProgress) {
        return
      }

      // Persist the current prompt
      this.setLocalPrompt(this.prompt)
      // Request to handle the current command
      this.$emit('handle', this.command)
      this.setPlaceholder('')
    },

    // Emits the current cursor position
    emitCursor () {
      this.$emit('cursor', this.$refs.input.selectionStart)
    },

    setPlaceholder (placeholder) {
      this.placeholder = placeholder
    },

    setCommand (command) {
      this.command = command
    },

    setLocalPrompt (localPrompt) {
      this.localPrompt = localPrompt
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  display: flex;

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
