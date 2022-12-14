<template>
  <div class="vue-command__query">
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
      class="vue-command__query-input"
      :disabled="isDisabled"
      :placeholder="placeholder"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      @click="setCursorPosition($refs.queryRef.selectionStart)"
      @input="setQuery($event.target.value)"
      @keyup.enter.exact="dispatch($event.target.value)"
      @keydown="eventHandler" />
  </div>
</template>

<script setup>
// TODO: Stop watchers
import { defineProps, defineEmits, ref, onMounted, watch, inject, computed, defineComponent, nextTick } from 'vue'

// Suffix "KEY" is added to avoid JavaScript collisions
const ARROW_UP_KEY = 38
const ARROW_DOWN_KEY = 40
const C_KEY = 67
const R_KEY = 82
const TAB_KEY = 9

const props = defineProps({
  prompt: {
    type: String,
    required: false
  }
})

const emits = defineEmits(['dispatch'])

const context = inject('context')

// Focuses query input
const focus = () => {
  queryRef.value.focus()
}

const dispatch = query => {
  isDisabled.value = true
  emits('dispatch', query)
}

const setQuery = inject('setQuery')

const isDisabled = ref(false)
const placeholder = ref('')
const query = ref(context.value.query)
const queryRef = ref(null)

watch(query, () => {
  setCursorPosition(queryRef.value.selectionStart)
})

const setCursorPosition = inject('setCursorPosition')

// Apply given cursor position to actual cursor position
watch(() => context.cursorPosition, cursorPosition => {
  // TODO: Unwatch to avoid check
  if (isDisabled.value) {
    return
  }

  queryRef.value.input.setSelectionRange(cursorPosition, cursorPosition)
})

const environment = inject('environment')

const hidePrompt = environment.value.hidePrompt

onMounted(() => {
  focus()

  const helpText = environment.value.helpText
  const helpTimeout = environment.value.helpTimeout
  const showHelp = environment.value.showHelp

  if (showHelp && !isDisabled.value) {
    const timeout = setTimeout(() => {
      placeholder.value = helpText
    }, helpTimeout)

    watch(isDisabled, () => {
      clearTimeout(timeout)
    })
  }
})

watch(isDisabled, () => {
  placeholder.value = ''
})

const eventHandler = event => {
  switch (event.keyCode) {
    case ARROW_UP_KEY:
      break
    case ARROW_DOWN_KEY:
      break
  }
}
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
