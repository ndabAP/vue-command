import VueCommand from './components/VueCommand'
import { ARROW_DOWN_KEY, ARROW_UP_KEY, TAB_KEY } from './constants/keys'

// Returns a Stdout component containing a span element with given inner content
export const createStdout = (content, isEscapeHtml = false, name = 'VueCommandStdout', ...mixins) => ({
  name,
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a Stderr component containing a span element with given inner content
export const createStderr = (content, isEscapeHtml = false, name = 'VueCommandStderr', ...mixins) => ({
  name,
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => {
    if (isEscapeHtml) {
      return createElement('span', {}, content)
    }

    return createElement('span', { domProps: { innerHTML: content } })
  }
})

// Returns a dummy Stdout component to not show a Stdout
export const createDummyStdout = (...mixins) => ({
  name: 'VueCommandDummyStdout',
  mixins,
  inject: ['terminate'],
  async mounted () {
    // Wait for user mutations
    await this.$nextTick()

    this.terminate()
  },

  render: createElement => createElement('span', {}, '')
})

export const historyKeyboardResolver = (
  event,
  {
    methods: { setStdin, setPointer },
    context: { executed, pointer }
  }
) => {
  // Check if pointer is mutable and input key is up or key
  if (event.key === ARROW_UP_KEY && pointer > 0) {
    pointer--
    setPointer(pointer)

    // Set current Stdin to pointed command
    setStdin([...executed][pointer])

    event.preventDefault()
  } else if (event.key === ARROW_DOWN_KEY && pointer < (executed.size - 1)) {
    pointer++
    setPointer(pointer)

    // Set current Stdin to pointed command
    setStdin([...executed][pointer])

    event.preventDefault()
  }
}

export const autcompletionKeyboardResolver = (
  event,
  {
    methods: { setStdin },
    context: { builtIn, commands, history, stdin }
  }
) => {
  if (event.key !== TAB_KEY) {
    return
  }

  event.preventDefault()

  // Make sure only programs are autocompleted since there is no support for arguments, yet
  const command = stdin.split(' ')
  if (command.length > 1) {
    return
  }

  const autocompleteableProgram = command[0]
  // Collect all autocompletion candidates
  let candidates = []
  const programs = [...Object.keys(commands), ...Object.keys(builtIn)].sort()
  programs.forEach(program => {
    if (program.startsWith(autocompleteableProgram)) {
      candidates.push(program)
    }
  })

  // Autocompletion resolved into multiple results
  if (stdin !== '' && candidates.length > 1) {
    history.push({
    // Build table programmatically
      render: createElement => {
        const columns = candidates.length < 5 ? candidates.length : 4
        const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

        let index = 0
        let table = []
        for (let i = 0; i < rows; i++) {
          let row = []
          for (let j = 0; j < columns; j++) {
            row.push(createElement('td', candidates[index]))

            index++
          }

          table.push(createElement('tr', [row]))
        }

        return createElement('table', { style: { width: '100%' } }, [table])
      }
    })
  }

  // Autocompletion resolved into one result
  if (candidates.length === 1) {
    setStdin(candidates[0])
  }
}

export default VueCommand
