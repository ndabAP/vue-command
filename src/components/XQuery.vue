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
      v-model="query"
      :disabled="isRunning || !isActive"
      class="vue-command__query-input"
      type="text"
      autocorrect="off"
      autocapitalize="none"
      @input="onInput($event.target.value)"
      @keyup.enter.exact="submit" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true
  },

  isRunning: {
    type: Boolean,
    required: true
  },

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

const query = ref('')

const emits = defineEmits(['update:modelValue', 'submit'])

const onInput = modalValue => {
  query.value = modalValue
  emits('update:modelValue', modalValue)
}

const queryRef = ref(null)

// Focuses current input
const focus = () => {
  queryRef.value.focus()
}

onMounted(() => {
  focus()
})

const submit = () => {
  emits('submit')
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
