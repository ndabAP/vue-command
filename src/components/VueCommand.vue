<template>
  <div
    class="vue-command"
    @keyup="mutatePointerHandler"
    @keydown.tab.prevent="autocomplete"
    @click="focusLastStdin">
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
          class="term-cont">
          <div v-if="showIntro">
            {{ intro }}
          </div>

          <div
            v-for="(stdout, index) in history"
            :key="index"
            :class="{ fullscreen : (isFullscreen && index === progress - 1) }">
            <stdout
              v-if="index !== 0"
              v-show="(!isFullscreen || index === progress - 1)"
              :component="stdout"
              class="term-stdout"/>

            <stdin
              v-show="(index === 0 && !isFullscreen) || !(index === progress - 1 && isInProgress) && !isFullscreen"
              ref="stdin"
              :bus="bus"
              :hide-prompt="hidePrompt"
              :is-fullscreen="isFullscreen"
              :is-in-progress="isInProgress"
              :is-last="index === progress - 1"
              :last-command="lastCommand"
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
import { createDummyStdout } from '../../lib'

// Event bus for communication
const EventBus = new Vue()

export default {
  components: { Stdin, Stdout },

  mixins: [Autocomplete, Handle, History],

  props: {
    autocompletionResolver: {
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
      required: true,
      type: Array
    },

    intro: {
      default: 'Fasten your seatbelts!',
      type: String
    },

    notFound: {
      default: 'command not found',
      type: String
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
    // Current input
    current: '',
    // Run command in fullscreen
    isFullscreen: false,
    // Indicates if a command is in progress
    isInProgress: false,

    // Detect scroll and resize events
    scroll: {
      eventListener: undefined,
      // Determinates if scolled to bottom
      isBottom: true,
      resizeObserver: undefined
    }
  }),

  provide () {
    return {
      setCurrent: this.setCurrent,
      setCursor: this.setCursor,
      setIsFullscreen: this.setIsFullscreen,
      setIsInProgress: this.setIsInProgress,
      setPointer: this.setPointer,
      terminate: this.terminate
    }
  },

  computed: {
    // Amount of executed commands
    progress: {
      get () {
        return this.history.length
      }
    }
  },

  watch: {
    current () {
      // Emit the current input as an event
      this.$emit('current', this.current)

      // Make searching history work again
      if (!this.current) {
        this.setPointer(this.executed.size)
        this.lastCommand = ''
      }
    }
  },

  mounted () {
    // Scroll to bottom if stdout mutates terminal height
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

    let history = [...this.history]
    history.push(createDummyStdout())
    this.$emit('update:history', [...history])
  },

  beforeDestroy () {
    this.scroll.resizeObserver.unobserve(this.$refs['term-cont'])
    this.$refs['term-std'].removeEventListener('scroll', this.scroll.eventListener)
  },

  methods: {
    setCurrent (current) {
      this.current = current
    },

    setIsFullscreen (isFullscreen) {
      this.isFullscreen = isFullscreen
    },

    setIsInProgress (isInProgress) {
      this.isInProgress = isInProgress
    },

    // Focus on last STDIN
    focusLastStdin () {
      const stdins = this.$refs.stdin
      // Latest STDIN is latest history entry
      const stdin = stdins[this.history.length - 1]

      stdin.focus()
    },

    // Executes common final tasks after command has been finished
    terminate () {
      this.setPointer(this.executed.size)
      this.setIsFullscreen(false)
      this.$emit('executed', this.current)
      this.setCurrent('')

      this.setIsInProgress(false)
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
    @extend .fullscreen;
  }

  .term-cont {
    font-family: "Inconsolata", monospace;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
    flex: 1;
    margin-top: 10px;
  }

  .fullscreen {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }
}
</style>
