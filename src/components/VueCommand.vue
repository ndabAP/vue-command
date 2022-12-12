<template>
  <div
    ref="vue-command"
    class="vue-command">
    <div class="window">
      <div class="window__actions">
        <span class="window__actionButton window__actionButton--close"></span>
        <span class="window__actionButton window__actionButton--minimize"></span>
        <span class="window__actionButton window__actionButton--fullscreen"></span>
      </div>

      <div class="window__content">
        <div
          v-for="(stdout, index) in history"
          :key="index"
          class="vue-command__history-entry">
          <x-stdout :component="stdout" />

          <x-query
            :modalValue="query"
            @update:modelValue="updateQuery"
            @enter="processQuery">
            <template #prompt>
              <slot name="prompt" />
            </template>
          </x-query>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onBeforeMount, defineEmits } from 'vue'
import XQuery from '@/components/XQuery.vue'
import XStdout from '@/components/XStdout.vue'
import { processQuery } from '@/composables/process'

const props = defineProps({
  commands: {
    required: false,
    type: Object
  },

  prompt: {
    required: false,
    type: String
  },

  history: {
    required: true,
    type: Array
  },

  query: {
    required: false,
    type: String
  }
})

const emits = defineEmits(['update:history', 'update:query'])

onBeforeMount(() => {
})

const updateQuery = query => {
  emits('update:query', query)
}
</script>

<style lang="scss">
.vue-command {

  @mixin clearfix() {

    &:before,
    &:after {
      content: " ";
      display: table;
    }

    &:after {
      clear: both;
    }
  }

  $seashell: #f1f1f1;

  .window {
    background-color: #111316;
    border-radius: 10px;
  }

  .window__actions {
    @include clearfix();
    position: relative;
    padding: 10px;
  }

  .window__actionButton {
    display: inline-block;
    border-radius: 100%;

    &:before {
      content: ' ';
      display: block;
      height: 13px;
      width: 13px;
    }

    &:not(:last-child) {
      margin-right: 7px;
    }
  }

  .window__actionButton--close {
    background-color: #ff5f58;
  }

  .window__actionButton--minimize {
    background-color: #ffbd2e;
  }

  .window__actionButton--fullscreen {
    background-color: #29ca41;
  }

  .window__content {
    display: block;
    padding: 10px 10px 10px;
    margin: 0;
    white-space: pre-line;
    line-height: 1.33;
    color: $seashell;
  }
}
</style>
