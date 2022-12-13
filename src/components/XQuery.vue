<template>
  <div class="vue-command__query">
    <slot name="prompt">
      <span class="vue-command__query-prompt">
        {{ prompt }}
      </span>
    </slot>

    <input
      ref="queryRef"
      v-model="query"
      :disabled="isDisabled"
      autocapitalize="none"
      autocorrect="off"
      class="vue-command__query-input"
      type="text"
      @click="setCursorPosition($refs.queryRef.selectionStart)"
      @keyup="setCursorPosition($refs.queryRef.selectionStart)"
      @keyup.enter.exact="dispatch($event.target.value)" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch, inject, computed, defineComponent } from 'vue'

const props = defineProps({
  prompt: {
    type: String,
    required: false
  }
})

const context = inject('context')

// Focuses query input
const focus = () => {
  queryRef.value.focus()
}

const dispatch = (query) => {
  isDisabled.value = true
  emits('dispatch', query)
}

const emits = defineEmits(['dispatch'])

const isDisabled = ref(false)
const query = ref('')
const queryRef = ref(null)

onMounted(focus)

const setCursorPosition = inject('setCursorPosition')

watch(() => context.cursorPosition, cursorPosition => {
  if (isDisabled.value) {
    return
  }

  queryRef.value.input.setSelectionRange(cursorPosition, cursorPosition)
})
</script>

<style lang="scss">
.vue-command {
  .vue-command__query {
    display: flex;
  }

  .vue-command__query-input {
    background: none;
    border: none;
    outline: none;
    flex: 1;
    width: 100%;
    font-family: monospace;
    font-size: 1rem;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .vue-command__query-prompt {
    margin-right: 0.25rem;
  }
}
</style>
