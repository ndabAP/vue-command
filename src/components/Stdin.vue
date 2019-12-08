<template>
  <div v-show="!isLast || !isInProgress">
    <span
      v-if="!hidePrompt"
      :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"
      class="term-ps">
      <template v-if="isLast || !keepPrompt">{{ prompt }}</template>
      <template v-if="!isLast && keepPrompt">{{ localPrompt }}</template>
    </span>
    <span class="term-stdin">
      <input
        ref="input"
        v-model="command"
        :autofocus="isLast"
        :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"
        :disabled="!isLast"
        :placeholder="placeholder"
        type="text"
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
      default: false,
      required: true
    },

    lastCommand: {
      type: String,
      default: ''
    },

    keepPrompt: {
      type: Boolean,
      default: false
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
    },

    whiteTheme: {
      type: Boolean
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

    this.bus.$on('autocomplete', onAutocomplete)
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
  .term-ps {
    margin-right: 0.5rem;
  }

  input {
    background: none;
    border: none;
    font-family: "Inconsolata", monospace;
    font-size: 1rem;
    outline: none;
    width: 60%;
  }

  @media only screen and (max-width: 400px) {
    input {
      width: 40%;
    }

    ::-webkit-input-placeholder {
      color: transparent;
    }
    :-moz-placeholder {
      color: transparent;
    }
    ::-moz-placeholder {
      color: transparent;
    }
    :-ms-input-placeholder {
      color: transparent;
    }
  }

  .term-stdin {
    background: none;
    margin: 0;
    border: 0;
    color: inherit;
    font-family: inherit;
    font-size: 1rem;
  }
}
</style>
