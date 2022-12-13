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
      :disabled="isDisabled"
      class="vue-command__query-input"
      type="text"
      autocorrect="off"
      autocapitalize="none"
      @keyup.enter.exact="dispatch($event.target.value)" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch, inject, computed, defineComponent } from 'vue'

// Focuses current input
const focus = () => {
  queryRef.value.focus()
}

const dispatch = (query) => {
  isDisabled.value = true
  emits('dispatch', query)
}

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

const emits = defineEmits(['dispatch'])

const isDisabled = ref(false)
const query = ref('')
const queryRef = ref(null)

onMounted(focus)
</script>

<style lang="scss">
@import "../scss/mixins";

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
