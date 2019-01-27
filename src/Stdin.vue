<template>
  <div>
    <span v-if="!hidePrompt">{{ prompt }} </span>
    <span class="term-cmd">
            <input
              :disabled="isDisabled"
              :placeholder="placeholder"
              @keyup.enter="handle"
              v-model="command"
              type="text"
              class="cli-input right"
              name="cli-input"
              :autofocus="!isDisabled"
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
    }
  },

  data: () => ({
    isDisabled: false,
    command: '',
    placeholder: ''
  }),

  created () {
    setTimeout(() => {
      if (this.isLast && !this.isDisabled && this.showHelp) this.placeholder = this.placeholderText
    }, 4000)
  },

  methods: {
    handle () {
      this.$emit('handle', this.command)

      this.isDisabled = true
      this.placeholder = ''
    }
  },

  watch: {
    lastCommand () {
      if (!isEmpty(this.lastCommand) && this.isLast) this.command = clone(this.lastCommand)
    }
  }
}
</script>

<style>
  .term-cmd {
    background: none;
    margin: 0;
    border: 0;
    color: inherit;
    font-family: inherit;
    font-size: 1rem;
  }
</style>
