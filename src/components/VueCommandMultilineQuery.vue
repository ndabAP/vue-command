<template>
  <div
    :class="{
      'vue-command__multiline-query': !invert,
      'vue-command__multiline-query--invert': invert
    }">
    <span
      :class="{
        'vue-command__multiline-query__prompt': !invert,
        'vue-command__multiline-query__prompt--invert': invert
      }">></span>

    <input
      ref="multilineQueryRef"
      :class="{
        'vue-command__multiline-query__input': !invert,
        'vue-command__multiline-query__input--invert': invert
      }"
      :disabled="isOutdated"
      autocapitalize="none"
      autocorrect="off"
      type="text"
      :value="modelValue"
      @click="setCursorPosition(multilineQueryRef.selectionStart)"
      @input="setMultilineQuery($event.target.value)"
      @keyup.arrow-left.exact="setCursorPosition(multilineQueryRef.selectionStart)"
      @keyup.arrow-right.exact="setCursorPosition(multilineQueryRef.selectionStart)"
      @keyup.enter.exact="submit">
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  inject,
  defineExpose,
  defineEmits,
  defineProps,
  onBeforeMount,
  reactive,
  nextTick,
  computed
} from 'vue'
import {
  and,
  or
} from '@/utils'
import isEmpty from 'lodash.isempty'
import size from 'lodash.size'
import eq from 'lodash.eq'

const props = defineProps({
  isOutdated: {
    default: false,
    type: Boolean
  },

  modelValue: {
    default: '',
    type: String
  }
})

const emits = defineEmits(['update:modelValue', 'multilineQuerySubmited'])

const appendToHistory = inject('appendToHistory')
const dispatch = inject('dispatch')
const hidePrompt = inject('hidePrompt')
const invert = inject('invert')
const helpText = inject('helpText')
const helpTimeout = inject('helpTimeout')
const optionsResolver = inject('optionsResolver')
const parser = inject('parser')
const programs = inject('programs')
const setCursorPosition = inject('setCursorPosition')
const setQuery = inject('setQuery')
const signals = inject('signals')
const showHelp = inject('showHelp')
const submit = inject('submit')
const terminal = inject('terminal')

// Indicates if the query, including multiline queries, is invalid
const isOutdated = ref(false)
const multilineQueryRef = ref(null)

// Focuses the input
const focus = () => {
  multilineQueryRef.value.focus()
}
const setMultilineQuery = multilineQuery => {
  // TODO Doesn't update
  emits('update:modelValue', multilineQuery)
}
const unwatchTerminalCursorPosition = watch(
  () => terminal.value.cursorPosition,
  cursorPosition => {
    multilineQueryRef.value.setSelectionRange(cursorPosition, cursorPosition)
  }
)
// Free resources if query is outdated/inactive
const unwatchIsOutdated = watch(isOutdated, () => {
  unwatchTerminalCursorPosition()
  unwatchIsOutdated()
})

onMounted(() => {
  focus()
})
</script>

<style lang="scss">
.vue-command,
.vue-command--invert {

  .vue-command__multiline-query,
  .vue-command__multiline-query--invert {
    display: flex;

    input::placeholder,
    input {
      font: 1rem Consolas,
        Monaco,
        'Andale Mono',
        'Ubuntu Mono',
        monospace;
      ;
    }

    .vue-command__multiline-query,
    .vue-command__multiline-query--invert    {
      border: none;
      outline: none;
      flex: 1;
      width: 100%;

    }

    .vue-command__multiline-query__prompt,
    .vue-command__multiline-query__prompt {
      margin-right: 0.25rem;
    }
  }

  .vue-command__multiline-query,
  .vue-command__multiline-query--invert {
    display: flex;

    input::placeholder,
    input {
      font: 1rem Consolas,
        Monaco,
        'Andale Mono',
        'Ubuntu Mono',
        monospace;
      ;
    }

    .vue-command__multiline-query__input,
    .vue-command__multiline-query__input--invert {
      border: none;
      outline: none;
      flex: 1;
      width: 100%;

    }
  }
}
</style>
