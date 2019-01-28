<template>
  <div>
    <span
      v-if="!hidePrompt"
      :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }">
      {{ prompt }}
    </span>
    <span class="term-cmd">
      <input
        ref="input"
        :class="{ 'dark-font': whiteTheme, 'white-font': !whiteTheme }"
        :disabled="!isLast"
        :placeholder="placeholder"
        @keyup.enter="handle"
        v-model="command"
        type="text"
        class="cli-input right"
        name="cli-input"
        :autofocus="isLast"
      >
    </span>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import clone from 'lodash/clone'

export default {
  props: {
    prompt: {
      type: String
    },

    lastCommand: {
      type: String,
      default: ''
    },

    isLast: {
      type: Boolean,
      default: false,
      required: true
    },

    showHelp: {
      type: Boolean,
      default: false
    },

    placeholderText: {
      type: String
    },

    hidePrompt: {
      type: Boolean,
      default: false
    },

    whiteTheme: {
      type: Boolean
    }
  },

  data: () => ({
    isDisabled: false,
    command: '',
    placeholder: ''
  }),

  created () {
    setTimeout(() => {
      if (this.isLast && this.showHelp) this.placeholder = this.placeholderText
    }, 4000)
  },

  mounted () {
    this.$refs.input.focus()
    this.$_bus.$on('autocomplete', command => {
      if (this.isLast) this.command = command
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

    .term-cmd {
      background: none;
      margin: 0;
      border: 0;
      color: inherit;
      font-family: inherit;
      font-size: 1rem;
    }
  }
</style>
