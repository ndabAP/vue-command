<template>
  <div>
    <span>{{ prompt }} </span>
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
      type: String,
      default: '~neil@moon:#'
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

    help: {
      type: Boolean,
      default: false
    },

    placeHolderText: {
      type: String
    }
  },

  data: () => ({
    isDisabled: false,
    command: '',
    placeholder: ''
  }),

  created () {
    setTimeout(() => {
      if (this.isLast && !this.isDisabled && this.help) this.placeholder = this.placeHolderText
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
