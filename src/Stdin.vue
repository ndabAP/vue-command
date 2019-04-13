<template>
  <div>
    <span
      v-if="!hidePrompt"
      v-show="!isLast || !inProgress"
      :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }">
      {{ prompt }}
    </span>
    <span class="term-stdin">
      <input
        @keyup.enter="handle"
        ref="input"
        :autofocus="isLast"
        :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"
        :disabled="!isLast"
        :placeholder="placeholder"
        type="text"
        v-model="command"
      >
    </span>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import clone from 'lodash/clone'

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

    isLast: {
      type: Boolean,
      default: false,
      required: true
    },

    lastCommand: {
      type: String,
      default: ''
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
    },

    inProgress: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    // Determinate if input is disabled
    isDisabled: false,
    command: '',
    placeholder: ''
  }),

  created () {
    setTimeout(() => {
      if (this.isLast && this.showHelp) this.placeholder = this.helpText
    }, this.helpTimeout)
  },

  mounted () {
    this.$refs.input.scrollIntoView()
    this.$refs.input.focus()

    this.bus.$on('autocomplete', ({ command, uid }) => {
      if (this.isLast && this.uid === uid) this.command = command
    })
  },

  methods: {
    handle () {
      this.$emit('handle', this.command)

      this.placeholder = ''
    }
  },

  watch: {
    lastCommand () {
      if (!isEmpty(this.lastCommand) && this.isLast) this.command = clone(this.lastCommand)
    },

    command () {
      this.$emit('typing', this.command)
    },

    inProgress () {
      if (!this.inProgress && this.isLast) {
        this.$refs.input.scrollIntoView()
        this.$refs.input.focus()
      }
    }
  }
}
</script>

<style lang="scss">
  @import './scss/mixins';

  .vue-command {
    input {
      background: none;
      border: none;
      font-family: 'Inconsolata', monospace;
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
