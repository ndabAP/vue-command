import flushPromises from 'flush-promises'

import { getRandom, getMountedWrapper, enterAndTrigger, getEmptyCommands, getCommands } from './test-utilities'
import { ResizeObserver } from './polyfills'
import Stdin from '../../src/components/Stdin'
import Stdout from '../../src/components/Stdout'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

/* global jest */
global.ResizeObserver = ResizeObserver

describe('VueCommand.vue', () => {
  it('hides the bar', () => {
    const wrapper = getMountedWrapper({ hideBar: true }, getEmptyCommands())

    expect(wrapper.contains('.term-bar')).toBe(false)
  })

  it('has custom bar', () => {
    const wrapper = getMountedWrapper({ customBar: true }, getEmptyCommands(), { bar: '<div class="foo-bar"></div>' })
    console.log(wrapper.html())
    expect(wrapper.contains('.foo-bar')).toBe(true)
  })

  it('sets the intro', () => {
    const intro = getRandom()
    const wrapper = getMountedWrapper({ showIntro: true, intro }, getEmptyCommands())

    expect(wrapper.find('.term-cont > div:first-child').text()).toBe(intro)
  })

  it('sets the title', () => {
    const title = getRandom()
    const wrapper = getMountedWrapper({ title }, getEmptyCommands())

    expect(wrapper.find('.term-title').text()).toBe(title)
  })

  it('sets the prompt', () => {
    const prompt = getRandom()
    const wrapper = getMountedWrapper({ prompt }, getEmptyCommands())

    expect(wrapper.find(Stdin).find('span').text()).toBe(prompt)
  })

  it('hides the prompt', () => {
    const prompt = getRandom()
    const wrapper = getMountedWrapper({ prompt, hidePrompt: true }, getEmptyCommands())

    expect(wrapper.find(Stdin).find('span').text()).not.toBe(prompt)
  })

  it('sets the placeholder', async () => {
    jest.useFakeTimers()

    const helpText = getRandom()
    const wrapper = getMountedWrapper({ showHelp: true, helpTimeout: 0, helpText }, getEmptyCommands())

    jest.runAllTimers()

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').attributes('placeholder')).toBe(helpText)
  })

  it('sets command not found text', async () => {
    const command = getRandom()
    const notFound = getRandom()
    const wrapper = getMountedWrapper({ notFound }, getEmptyCommands())

    enterAndTrigger(wrapper, command)

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(Stdout).text()).toBe(`${command}: ${notFound}`)
  })

  it('doesn\'t find the command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getEmptyCommands())

    enterAndTrigger(wrapper, command)

    await wrapper.vm.$nextTick()

    enterAndTrigger(wrapper, command)
    expect(wrapper.find(Stdout).text()).toBe(`${command}: command not found`)
  })

  it('finds the command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getCommands(command))

    enterAndTrigger(wrapper, command)

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(Stdout).text()).toBe(command)
  })

  it('finds the asynchronous command', async () => {
    const command = getRandom()
    const commands = { [command]: () => new Promise(resolve => setTimeout(resolve(command), timeout)) }
    const timeout = 2000

    const wrapper = getMountedWrapper({}, commands)

    enterAndTrigger(wrapper, command)

    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find(Stdout).text()).toBe(command)
  })

  it('finds the previous command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getEmptyCommands())

    enterAndTrigger(wrapper, command)
    await flushPromises()
    wrapper.find('input').trigger('keyup.ArrowUp')

    expect(wrapper.find('input').element.value).toBe(command)
  })

  it('executes built-in commands', async () => {
    const command = getRandom()
    const builtIn = { builtIn: { [command]: () => command } }
    const wrapper = getMountedWrapper(builtIn, getEmptyCommands())

    enterAndTrigger(wrapper, command)
    await flushPromises()
    expect(wrapper.find(Stdout).text()).toBe(command)
  })

  it('calls the autocompletion resolver with arguments', async () => {
    const command = getRandom()
    const autocompletionResolver = jest.fn(() => command)

    const wrapper = getMountedWrapper({ autocompletionResolver }, getCommands(command))

    wrapper.find('input').setValue(command)
    await wrapper.vm.$nextTick()

    wrapper.find('input').trigger('keydown.tab.prevent')
    await wrapper.vm.$nextTick()

    expect(autocompletionResolver.mock.calls[0][0]).toBe(command)
    expect(autocompletionResolver.mock.calls[0][1]).toBe(0)
  })
})
