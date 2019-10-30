import flushPromises from 'flush-promises'
import { randomString, generateWrapper, enterAndTrigger } from './utils'

import Stdin from '../../src/components/Stdin'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

describe('VueCommand.vue', () => {
  it('hides the bar', () => {
    const wrapper = generateWrapper({
      hideBar: true
    })

    expect(wrapper.contains('.term-bar')).toBe(false)
  })

  it('sets the intro', () => {
    const intro = randomString()
    const wrapper = generateWrapper({
      showIntro: true,
      intro
    })

    expect(wrapper.find('.term-cont > div:first-child').text()).toBe(intro)
  })

  it('sets the title', () => {
    const title = randomString()
    const wrapper = generateWrapper({ title })

    expect(wrapper.find('.term-title').text()).toBe(title)
  })

  it('sets the prompt', () => {
    const prompt = randomString()
    const wrapper = generateWrapper({ prompt })

    expect(wrapper.find(Stdin).find('span').text()).toBe(prompt)
  })

  it('hides the prompt', () => {
    const prompt = randomString()
    const wrapper = generateWrapper({ prompt, hidePrompt: true })

    expect(wrapper.find(Stdin).find('span').text()).not.toBe(prompt)
  })

  it('sets the placeholder', () => {
    jest.useFakeTimers()

    const helpText = randomString()
    const wrapper = generateWrapper({
      showHelp: true,
      helpTimeout: 0,
      helpText
    })

    jest.runAllTimers()

    expect(wrapper.find('input').attributes('placeholder')).toBe(helpText)
  })

  it('sets command not found text', () => {
    const command = randomString()
    const notFound = randomString()
    const wrapper = generateWrapper({ notFound })

    enterAndTrigger(wrapper, command)
    expect(wrapper.find('.term-stdout').text()).toBe(`${command}: ${notFound}`)
  })

  it('doesn\'t find the command', () => {
    const command = randomString()
    const wrapper = generateWrapper({ commands: {} })

    enterAndTrigger(wrapper, command)
    expect(wrapper.find('.term-stdout').text()).toBe(`${command}: command not found`)
  })

  it('finds the command', async () => {
    const command = randomString()
    const wrapper = generateWrapper({ commands: { [command]: () => command } })

    enterAndTrigger(wrapper, command)

    await flushPromises()

    expect(wrapper.find('.term-stdout').text()).toBe(command)
  })

  it('finds the asynchronous command', async () => {
    const command = randomString()
    const timeout = 2000
    const wrapper = generateWrapper({
      commands: { [command]: () => new Promise(resolve => setTimeout(resolve(command), timeout)) }
    })

    enterAndTrigger(wrapper, command)
    await flushPromises()

    expect(wrapper.find('.term-stdout').text()).toBe(command)
  })

  it('finds the previous command', async () => {
    const command = randomString()
    const wrapper = generateWrapper({
      commands: { [command]: () => command }
    })

    enterAndTrigger(wrapper, command)
    await flushPromises()
    wrapper.find('input').trigger('keyup.ArrowUp')

    expect(wrapper.find('input').element.value).toBe(command)
  })

  it('executes built-in commands', async () => {
    const command = randomString()
    const wrapper = generateWrapper({
      builtIn: { [command]: () => command },
      commands: {}
    })

    enterAndTrigger(wrapper, command)
    await flushPromises()
    expect(wrapper.find('.term-stdout').text()).toBe(command)
  })

  it('calls the autocompletion resolver with arguments', () => {
    const command = randomString()
    const autocompletionResolver = jest.fn(() => command)

    const wrapper = generateWrapper({
      commands: { [command]: () => command },
      autocompletionResolver
    })

    wrapper.find('input').setValue(command)
    wrapper.find('input').trigger('keydown.tab.prevent')

    expect(autocompletionResolver.mock.calls[0][0]).toBe(command)
    expect(autocompletionResolver.mock.calls[0][1]).toBe(0)
  })
})
