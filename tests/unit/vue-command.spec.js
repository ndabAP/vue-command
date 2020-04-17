import { ResizeObserver } from './polyfills'
import {
  getRandom,
  getMountedWrapper,
  enterAndTrigger,
  getEmptyCommands,
  getCommands,
  getDefaultProps
} from './test-utilities'
import { createStdout } from '../../src/library'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

/* global jest */
global.ResizeObserver = ResizeObserver

// See: https://github.com/vuejs/vue-test-utils/issues/1497
describe('VueCommand.vue', () => {
  it('hides the bar', () => {
    const wrapper = getMountedWrapper({ hideBar: true, ...getDefaultProps() }, getEmptyCommands())

    expect(wrapper.contains('.term-bar')).toBe(false)
  })

  it('has custom bar', () => {
    const wrapper = getMountedWrapper({ ...getDefaultProps() }, getEmptyCommands(), { bar: '<div class="foo-bar"></div>' })

    expect(wrapper.contains('.foo-bar')).toBe(true)
  })

  it('sets the intro', () => {
    const intro = getRandom()
    const wrapper = getMountedWrapper({ showIntro: true, intro, ...getDefaultProps() }, getEmptyCommands())

    expect(wrapper.find('.term-cont > div:first-child').text()).toBe(intro)
  })

  it('sets the title', () => {
    const title = getRandom()
    const wrapper = getMountedWrapper({ title, ...getDefaultProps() }, getEmptyCommands())

    expect(wrapper.find('.term-title').text()).toBe(title)
  })

  it('sets the prompt', async () => {
    const prompt = getRandom()
    const wrapper = getMountedWrapper({ prompt, ...getDefaultProps() }, getEmptyCommands())

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.term-ps').text()).toBe(prompt)
  })

  it('hides the prompt', () => {
    const prompt = getRandom()
    const wrapper = getMountedWrapper({ prompt, hidePrompt: true, ...getDefaultProps() }, getEmptyCommands())

    expect(wrapper.find('.term-stdin-container span').text()).not.toBe(prompt)
  })

  it('sets the placeholder', async () => {
    jest.useFakeTimers()

    const helpText = getRandom()
    const wrapper = getMountedWrapper({ showHelp: true, helpTimeout: 0, helpText, ...getDefaultProps() }, getEmptyCommands())

    jest.runAllTimers()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').attributes('placeholder')).toBe(helpText)
  })

  it('sets command not found text', async () => {
    const command = getRandom()
    const notFound = getRandom()
    const wrapper = getMountedWrapper({ notFound, executed: new Set() }, getEmptyCommands())

    enterAndTrigger(wrapper, command)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.term-stdout').at(1).text()).toBe(`${command}: ${notFound}`)
  })

  it('doesn\'t find the command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({ executed: new Set() }, getEmptyCommands())

    enterAndTrigger(wrapper, command)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.term-stdout').at(1).text()).toBe(`${command}: command not found`)
  })

  it('finds the command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({ executed: new Set() }, getCommands(command))

    enterAndTrigger(wrapper, command)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.term-stdout').at(1).text()).toBe(command)
  })

  it('finds the asynchronous command', async () => {
    const command = getRandom()
    const stdout = createStdout(command)
    const timeout = 2000
    const commands = { [command]: () => new Promise(resolve => setTimeout(resolve(stdout), timeout)) }
    const wrapper = getMountedWrapper({ executed: new Set() }, commands)

    enterAndTrigger(wrapper, command)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.term-stdout').at(1).text()).toBe(command)
  })

  it('finds the previous command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({ ...getDefaultProps() }, getEmptyCommands())

    enterAndTrigger(wrapper, command)
    await wrapper.vm.$nextTick()
    wrapper.find('input').trigger('keydown.ArrowUp')

    expect(wrapper.find('input').element.value).toBe(command)
  })

  it('finds the built-in command', async () => {
    const command = getRandom()
    const builtIn = jest.fn()
    const wrapper = getMountedWrapper({ builtIn: { [command]: builtIn }, executed: new Set() }, getEmptyCommands())

    enterAndTrigger(wrapper, command)
    await wrapper.vm.$nextTick()

    expect(builtIn.mock.calls[0][0]).toBe(command)
  })

  it('calls the autocompletion resolver with arguments', async () => {
    const command = getRandom()
    const autocompletionResolver = jest.fn(() => command)
    const wrapper = getMountedWrapper({ autocompletionResolver, ...getDefaultProps() }, getCommands(command))

    wrapper.find('input').setValue(command)
    await wrapper.vm.$nextTick()

    wrapper.find('input').trigger('keydown.tab.prevent')
    await wrapper.vm.$nextTick()

    expect(autocompletionResolver.mock.calls.length).toBe(1)
  })
})
