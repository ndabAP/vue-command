<template>
  <div
    ref="vue-command"
    class="vue-command">

    <slot name="bar">
      <div
        v-if="!hideBar"
        class="term-bar">
        <span
          v-if="!hideTitle"
          class="term-title">
          {{ title }}
        </span>
      </div>
    </slot>

    <div
      ref="term-std"
      class="term-std">
      <search
        v-if="isSearch"
        ref="search"
        :executed="local.executed"
        :is-search.sync="isSearch"
        :stdin="stdin"
        @click="focus"
        @handle="handle"/>

      <div
        v-show="!isSearch"
        ref="term-cont"
        :class="{ 'term-cont-fullscreen': local.isFullscreen }"
        class="term-cont"
        @click="focus">
        <div v-if="showIntro">
          {{ intro }}
        </div>

        <div
          v-for="(stdout, index) in local.history"
          :key="index"
          class="term-hist"
          :class="{ 'term-hist-fullscreen' : (local.isFullscreen && index === local.history.length - 1) }">
          <stdout
            v-show="(!local.isFullscreen || index === local.history.length - 1)"
            :component="stdout"
            class="term-stdout"/>

          <stdin
            v-show="(index === 0 && !local.isFullscreen) || !(index === local.history.length - 1 && local.isInProgress) && !local.isFullscreen"
            ref="stdin"
            :bus="bus"
            :cursor="local.cursor"
            :hide-prompt="hidePrompt"
            :is-fullscreen="local.isFullscreen"
            :is-in-progress="local.isInProgress"
            :is-last="index === local.history.length - 1"
            :prompt="prompt"
            :help-text="helpText"
            :help-timeout="helpTimeout"
            :show-help="showHelp"
            :stdin.sync="local.stdin"
            :uid="_uid"
            @handle="handle">
            <template #prompt>
              <slot name="prompt" />
            </template>
          </stdin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import Search from './Search'
import Stdin from './Stdin'
import Stdout from './Stdout'
import AutocompleteMixin from '../mixins/autocomplete'
import HandleMixin from '../mixins/handle'
import HistoryMixin from '../mixins/history'
import SearchMixin from '../mixins/search'
import UIMixin from '../mixins/ui'
import { EVENT_LISTENERS } from './../library'

// Event bus for communication
const EventBus = new Vue()

export default {
  components: { Search, Stdin, Stdout },

  mixins: [AutocompleteMixin, HandleMixin, HistoryMixin, SearchMixin, UIMixin],

  provide () {
    return {
      emitExecute: this.emitExecute,
      emitExecuted: this.emitExecuted,
      emitInput: this.emitInput,
      setStdin: this.setStdin
    }
  },

  props: {
    autocompletionResolver: {
      default: undefined,
      type: Function
    },

    builtIn: {
      default: undefined,
      type: Function
    },

    commands: {
      default: () => ({}),
      type: Object
    },

    cursor: {
      default: 0,
      type: Number
    },

    // Default event listeners
    eventListeners: {
      default: () => ([
        EVENT_LISTENERS.autocomplete,
        EVENT_LISTENERS.history,
        EVENT_LISTENERS.search
      ]),

      type: Array
    },

    // Non-empty executed commands
    executed: {
      default: () => new Set(),
      type: Set
    },

    helpTimeout: {
      default: 4000,
      type: Number
    },

    hideBar: {
      default: false,
      type: Boolean
    },

    hidePrompt: {
      default: false,
      type: Boolean
    },

    hideTitle: {
      default: false,
      type: Boolean
    },

    helpText: {
      default: 'Type help',
      type: String
    },

    // All executed commands
    history: {
      default: () => [],
      type: Array
    },

    intro: {
      default: 'Fasten your seatbelts!',
      type: String
    },

    isFullscreen: {
      default: false,
      type: Boolean
    },

    isInProgress: {
      default: false,
      type: Boolean
    },

    notFound: {
      default: 'command not found',
      type: String
    },

    // Options when parsing Stdin
    parserOptions: {
      default: () => ({}),
      type: Object
    },

    // History command pointer
    pointer: {
      default: 0,
      type: Number
    },

    prompt: {
      default: '~neil@moon:#/',
      type: String
    },

    showHelp: {
      default: false,
      type: Boolean
    },

    showIntro: {
      default: false,
      type: Boolean
    },

    // Current Stdin
    stdin: {
      default: '',
      type: String
    },

    title: {
      default: 'neil@moon: ~',
      type: String
    }
  },

  data: () => ({
    // Bus for communication
    bus: EventBus,

    // A local copy to allow the absence of properties
    local: {
      // Current Stdin
      stdin: ''
    },

    // Detect scroll and resize events
    scroll: {
      eventListener: undefined,
      // Determinates if scolled to bottom
      isBottom: true,
      resizeObserver: undefined
    }
  }),

  watch: {
    stdin () {
      this.setStdin(this.stdin)
    },

    'local.stdin' () {
      // Emit the current Stdin as an event
      this.$emit('input', this.local.stdin)

      // Update given property
      this.$emit('update:stdin', this.local.stdin)

      // Make searching history work again
      if (this.local.stdin === '') {
        this.setPointer(this.local.executed.size)
      }
    }
  },

  mounted () {
    // Scroll to bottom if Stdout mutates terminal height
    this.scroll.resizeObserver = new ResizeObserver(async event => {
      await this.$nextTick()

      // Only scroll to bottom if it was scrolled to bottom before
      if (this.scroll.isBottom) {
        this.$refs['term-std'].scrollTop = this.$refs['term-std'].scrollHeight
      }
    })

    this.scroll.resizeObserver.observe(this.$refs['term-cont'])

    // Check if scrolled to bottom
    this.scroll.eventListener = () => {
      const terminal = this.$refs['term-std']
      this.scroll.isBottom = (terminal.scrollHeight - terminal.scrollTop - terminal.clientHeight) === 0
    }

    this.$refs['term-std'].addEventListener('scroll', this.scroll.eventListener)

    // Bind given event listeners
    this.eventListeners.forEach(eventListener => eventListener(this))
  },

  created () {
    // Observe "executed" changes since Vue.js can't watch a "Set". See: https://github.com/ndabAP/vue-command/issues/151
    this.executed.add = function (...x) {
      this.local.executed.add(...x)

      Object.getPrototypeOf(this).add.call(this, ...x)
    }
    this.executed.clear = function () {
      this.local.executed.clear()

      Object.getPrototypeOf(this).add.call(this)
    }
    this.executed.delete = function (...x) {
      this.local.executed.delete(...x)

      Object.getPrototypeOf(this).delete.call(this, ...x)
    }

    // Apply user given properties
    this.setCursor(this.cursor)
    this.setPointer(this.pointer)
    this.setStdin(this.stdin)
    this.setIsInProgress(this.isInProgress)
    this.setIsFullscreen(this.isFullscreen)

    const history = [...this.history]
    // If there is no entry push dummy Stdout to show Stdin
    if (history.length === 0) {
      // Push dummy Stdout without termination
      history.push({
        name: 'VueCommandDummyStdout',
        render: createElement => createElement('span', {}, '')
      })

      // Update the history property
      this.$emit('update:history', [...history])
    }

    this.setHistory([...history])
  },

  methods: {
    emitInput (input) {
      this.$emit('input', input)
    },

    emitExecute () {
      this.$emit('execute')
    },

    emitExecuted () {
      this.$emit('executed')
    },

    // Focus on last Stdin or search
    focus () {
      // If user selected any text skip setting focus as otherwise the selection gets removed
      if (window.getSelection().toString() !== '') return

      // Check if search mode
      if (this.isSearch) {
        this.$refs.search.focus()

        return
      }

      // Latest Stdin is latest history entry
      const stdin = this.$refs.stdin[this.local.history.length - 1]
      // Call component method
      stdin.focus()
    },

    setStdin (stdin) {
      this.local.stdin = stdin
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  overflow-y: auto;
  overflow-x: hidden;

  .term-bar {
    background: $background;
    border-bottom: 1px solid #252525;
    display: block;
    height: 32px;
    justify-content: center;
    top: 0;
    width: 100%;
    display: flex;
  }

  .term-title {
    font-family: "Montserrat", sans-serif;
    font-size: 0.85rem;
    margin: auto 0;
  }

  .term-std {
    background: $background;
    display: block;
    flex-direction: column;
    width: 100%;
    border: 0px solid $background;

    @extend .term-hist-container-fullscreen;
  }

  .term-cont {
    font-family: "Inconsolata", monospace;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
    flex: 1;
    margin-top: 10px;
  }

  .term-hist-container-fullscreen {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }

  .term-stdout {
    word-break: break-all;
  }
}
</style>
