<template>
  <div
    class="vue-command"
    @keyup="mutatePointerHandler"
    @keydown.tab.prevent="autocomplete">
    <div
      :class="{ 'white-theme': whiteTheme }"
      class="term">
      <div
        v-if="!hideBar"
        class="term-bar">
        <span class="term-title">
          {{ title }}
        </span>
      </div>

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
            v-for="(entry, index) in history"
            :key="index"
            :class="{ fullscreen : (isFullscreen && index === progress - 1)}">
            <stdout
              v-if="index !== 0"
              v-show="(!isFullscreen || index === progress - 1)"
              :component="entry.stdout"
              class="term-stdout"/>

            <stdin
              :bus="bus"
              :hide-prompt="hidePrompt"
              :is-fullscreen="isFullscreen"
              :is-in-progress="isInProgress"
              :is-last="index === progress - 1"
              :last-command="last"
              :prompt="entry.prompt"
              :help-text="helpText"
              :help-timeout="helpTimeout"
              :show-help="showHelp"
              :uid="_uid"
              @cursor="setCursor"
              @handle="handle"
              @typing="setCurrent" />
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
      type: Object,
      default: () => ({})
    },

    commands: {
      type: Object,
      required: true
    },

    helpTimeout: {
      type: Number,
      default: 4000
    },

    hideBar: {
      type: Boolean,
      default: false
    },

    hidePrompt: {
      type: Boolean,
      default: false
    },

    helpText: {
      type: String,
      default: 'Type help'
    },

    intro: {
      type: String,
      default: 'Fasten your seatbelts!'
    },

    notFound: {
      type: String,
      default: 'command not found'
    },

    prompt: {
      type: String,
      default: '~neil@moon:#'
    },

    showHelp: {
      type: Boolean,
      default: false
    },

    showIntro: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: 'neil@moon: ~'
    },

    whiteTheme: {
      type: Boolean,
      default: false
    },

    yargsOptions: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    // Bus for communication
    bus: EventBus,
    // Current input
    current: '',
    // Non-empty executed commands
    executed: new Set(),
    // Indicates if a command is in progress
    isInProgress: false,
    // run command in fullscreen
    isFullscreen: false,
    // Handle scroll behaviour
    scroll: {
      eventListener: undefined,
      isBottom: true,
      resizeObserver: undefined
    }
  }),

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
      this.$emit('input', this.current)

      // Make searching history work again
      if (!this.current) {
        this.setPointer(this.executed.size)
        this.last = ''
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
  },

  beforeDestroy () {
    this.scroll.resizeObserver.unobserve(this.$refs['term-cont'])
    this.$refs['term-std'].removeEventListener('scroll', this.scroll.eventListener)
  },

  methods: {
    setCurrent (current) {
      this.current = current.trim()
    },

    setIsInProgress (isInProgress) {
      this.isInProgress = isInProgress
    },

    setIsFullscreen (isFullscreen) {
      this.isFullscreen = isFullscreen
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ddd;
    -webkit-border-radius: 8px;
    border-radius: 8px;
  }

  .term {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid $background;
  }

  .term-bar {
    border-bottom: 1px solid #252525;
    display: flex;
    flex-direction: row;
    height: 32px;
    justify-content: center;
    top: 0;
    width: 100%;
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
