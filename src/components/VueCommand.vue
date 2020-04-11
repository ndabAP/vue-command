<template>
  <div
    ref="vue-command"
    class="vue-command"
    @keyup.38.prevent="mutatePointerHandler"
    @keyup.40.prevent="mutatePointerHandler"
    @keyup.tab.prevent="autocomplete"
    @click="focus">

    <slot name="bar">
      <div
        v-if="!hideBar"
        class="term-bar">
        <span class="term-title">
          {{ title }}
        </span>
      </div>
    </slot>

    <div
      :class="{ 'white-theme': whiteTheme }"
      class="term">
      <div
        ref="term-std"
        class="term-std">
        <div
          ref="term-cont"
          :class="{ 'term-cont-fullscreen': local.isFullscreen }"
          class="term-cont">
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
              :current="local.current"
              :hide-prompt="hidePrompt"
              :is-fullscreen="local.isFullscreen"
              :is-in-progress="local.isInProgress"
              :is-last="index === local.history.length - 1"
              :prompt="prompt"
              :help-text="helpText"
              :help-timeout="helpTimeout"
              :show-help="showHelp"
              :uid="_uid"
              @handle="handle"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import Stdin from './Stdin'
import Stdout from './Stdout'
import Autocomplete from '../mixins/autocomplete'
import Handle from '../mixins/handle'
import History from '../mixins/history'
import UI from '../mixins/ui'

// Event bus for communication
const EventBus = new Vue()

export default {
  components: { Stdin, Stdout },

  mixins: [Autocomplete, Handle, History, UI],

  provide () {
    return {
      emitExecute: this.emitExecute,
      emitExecuted: this.emitExecuted,
      emitInput: this.emitInput,
      setCurrent: this.setCurrent
    }
  },

  props: {
    autocompletionResolver: {
      default: undefined,
      type: Function
    },

    builtIn: {
      default: () => ({}),
      type: Object
    },

    commands: {
      required: true,
      type: Object
    },

    current: {
      default: '',
      type: String
    },

    cursor: {
      default: 0,
      type: Number
    },

    // Non-empty executed commands
    executed: {
      required: true,
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

    pointer: {
      default: 0,
      type: Number
    },

    prompt: {
      default: '~neil@moon:#',
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

    title: {
      default: 'neil@moon: ~',
      type: String
    },

    whiteTheme: {
      default: false,
      type: Boolean
    },

    yargsOptions: {
      default: () => ({}),
      type: Object
    }
  },

  data: () => ({
    // Bus for communication
    bus: EventBus,

    // A local copy to allow the absence of properties
    local: {
      // Current input
      current: ''
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
    current () {
      this.setCurrent(this.current)
    },

    'local.current' () {
      // Emit the current input as an event
      this.$emit('input', this.local.current)

      // Update given property
      this.$emit('update:current', this.local.current)

      // Make searching history work again
      if (!this.local.current) {
        this.setPointer(this.executed.size)
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
  },

  beforeDestroy () {
    this.scroll.resizeObserver.unobserve(this.$refs['term-cont'])
    this.$refs['term-std'].removeEventListener('scroll', this.scroll.eventListener)
  },

  created () {
    this.setCurrent(this.current)
    this.setIsFullscreen(this.isFullscreen)
    this.setIsInProgress(this.isInProgress)
    this.setPointer(this.pointer)
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

    setCurrent (current) {
      this.local.current = current
    },

    // Focus on last Stdin
    focus () {
      const stdins = this.$refs.stdin
      // Latest Stdin is latest history entry
      const stdin = stdins[this.local.history.length - 1]

      // Call component method
      stdin.focus()
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  overflow-y: auto;
  overflow-x: hidden;

  .term {
    background: $background;
    display: block;
    flex-direction: column;
    width: 100%;
    border: 1px solid $background;
  }

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
