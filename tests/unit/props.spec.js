import flushPromises from 'flush-promises'

import { getRandom, getMountedWrapper, getEmptyCommands } from './test-utilities'
import { ResizeObserver } from './polyfills'
import Stdin from '../../src/components/Stdin'
import Stdout from '../../src/components/Stdout'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

const KEY_ENTER_EVENT = 'keyup.enter'

describe('Props', () => {
  it('hides the bar', () => {
    const wrapper = getMountedWrapper({ hideBar: true }, getEmptyCommands())

    expect(wrapper.find('.term-bar').exists()).toBe(false)
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

    expect(wrapper.findComponent(Stdin).find('span').text()).toBe(prompt)
  })

  it('hides the prompt', () => {
    const prompt = getRandom()
    const wrapper = getMountedWrapper({ prompt, hidePrompt: true }, getEmptyCommands())

    expect(wrapper.findComponent(Stdin).find('span').text()).not.toBe(prompt)
  })

  it('sets the placeholder', async () => {
    jest.useFakeTimers()

    const helpText = getRandom()
    const wrapper = getMountedWrapper({ showHelp: true, helpTimeout: 0, helpText }, getEmptyCommands())

    jest.runAllTimers()
    await flushPromises()

    expect(wrapper.find('input').attributes('placeholder')).toBe(helpText)
  })

  it('sets command not found text', async () => {
    const command = getRandom()
    const notFound = getRandom()
    const wrapper = getMountedWrapper({ notFound }, getEmptyCommands())

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)

    expect(wrapper.findAllComponents(Stdout).at(1).text()).toBe(`${command}: ${notFound}`)
  })
})
