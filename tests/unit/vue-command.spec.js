import { mount, shallowMount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import VueCommand from '../../src/VueCommand'
import Stdin from '../../src/Stdin'

const EMPTY_COMMANDS = { commands: { null: () => null } }

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

describe('VueCommand.vue', () => {
  it('hides the bar', () => {
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        hideBar: true
      }
    })

    expect(wrapper.contains('.term-bar')).toBe(false)
  })

  it('sets the intro', () => {
    const intro = Array.from(VueCommand.props.intro.default).reverse().join('')
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        showIntro: true,
        intro
      }
    })

    expect(wrapper.find('.term-cont:first-child').text()).toBe(intro)
  })

  it('sets the title', () => {
    const title = Array.from(VueCommand.props.title.default).reverse().join('')
    const wrapper = shallowMount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        title
      }
    })

    expect(wrapper.find('.term-title').text()).toBe(title)
  })

  it('sets the prompt', () => {
    const prompt = Array.from(VueCommand.props.title.default).reverse().join('')
    const wrapper = mount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        prompt
      }
    })

    expect(wrapper.find(Stdin).find('span').text()).toBe(prompt)
  })

  it('hides the prompt', () => {
    const prompt = Array.from(VueCommand.props.title.default).reverse().join('')
    const wrapper = mount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        prompt,
        hidePrompt: true
      }
    })

    expect(wrapper.find(Stdin).find('span').text()).not.toBe(prompt)
  })

  it('sets the placeholder', () => {
    jest.useFakeTimers()

    const helpText = Array.from(VueCommand.props.helpText.default).reverse().join('')
    const wrapper = mount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS,
        showHelp: true,
        helpTimeout: 0,
        helpText
      }
    })

    jest.runAllTimers()

    expect(wrapper.find('input').attributes('placeholder')).toBe(helpText)
  })

  it('doesn\'t find the command', () => {
    const command = Math.random().toString(36).substring(6)
    const wrapper = mount(VueCommand, {
      propsData: {
        ...EMPTY_COMMANDS
      }
    })

    wrapper.find('input').setValue(command)
    wrapper.find('input').trigger('keyup.enter')

    expect(wrapper.find('.term-stdout').text()).toBe(`${command}: command not found`)
  })

  it('finds the command', async () => {
    const command = Math.random().toString(36).substring(6)
    const wrapper = mount(VueCommand, {
      propsData: {
        commands: { [command]: () => command }
      }
    })

    wrapper.find('input').setValue(command)
    wrapper.find('input').trigger('keyup.enter')

    await flushPromises()

    expect(wrapper.find('.term-stdout').text()).toBe(command)
  })

  it('finds the asynchronous command', async () => {
    const command = Math.random().toString(36).substring(6)
    const timeout = 2000
    const wrapper = mount(VueCommand, {
      propsData: {
        commands: { [command]: () => new Promise(resolve => setTimeout(resolve(command), timeout)) }
      }
    })

    wrapper.find('input').setValue(command)
    wrapper.find('input').trigger('keyup.enter')

    await flushPromises()

    expect(wrapper.find('.term-stdout').text()).toBe(command)
  })
})
