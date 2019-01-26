<template>
  <div>
    <span class="term-prompt">{{ prompt }} </span>
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

    last: {
      type: String,
      default: ''
    },

    isLast: {
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
      this.placeholder = 'Type help'
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
    last () {
      if (!isEmpty(this.last) && this.isLast) this.command = clone(this.last)
    }
  }
}
</script>
