<template>
  <div class="vue-command__query-container">
    <slot name="prompt">
      <span
        v-if="!hidePrompt"
        class="vue-command__query-prompt">
        {{ prompt }}
      </span>
    </slot>

    <input
      ref="queryRef"
      :value="modalValue"
      class="vue-command__query-input"
      type="text"
      autocorrect="off"
      autocapitalize="none"
      @input="updateQuery"
      @keyup.enter.exact="enter" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'

const props = defineProps({
  modalValue: {
    default: '',
    type: String,
    required: false
  },

  hidePrompt: {
    default: false,
    type: Boolean,
    required: false
  },

  prompt: {
    default: '~$',
    type: String,
    required: false
  }
})

const emits = defineEmits(['update:modelValue', 'enter'])

const updateQuery = event => {
  emits('update:modelValue', event.target.value)
}

const queryRef = ref(null)

// Focuses current input
const focus = () => queryRef.value.focus()

onMounted(() => {
  focus()
})

const enter = () => {
  emits('enter')
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  .vue-command__query-container {
    display: flex;
  }

  .vue-command__query-input {
    background: none;
    border: none;
    font-family: "Ubuntu", monospace;
    font-size: 1rem;
    outline: none;
    flex: 1;
    width: 100%;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .vue-command__query-prompt {
    margin-right: 0.25rem;
  }
}
</style>
