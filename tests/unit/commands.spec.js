import {
  getRandom,
  getMountedWrapper,
  getEmptyCommands,
  getAsyncCommand,
  getCommand
} from './test-utilities'
import { ResizeObserver } from './polyfills'
import Stdout from '../../src/components/Stdout'

// See https://github.com/vuejs/vue-test-utils/issues/1219
Element.prototype.scrollIntoView = () => {}

// eslint-disable-next-line
/* global jest */
global.ResizeObserver = ResizeObserver

const KEY_ENTER_EVENT = 'keyup.enter'

describe('Commands', () => {
  it('doesn\'t find the command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getEmptyCommands())

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)

    expect(wrapper.findAllComponents(Stdout).at(1).text()).toBe(`${command}: command not found`)
  })

  it('finds the command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getCommand(command))

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)

    expect(wrapper.findAllComponents(Stdout).at(1).text()).toBe(command)
  })

  it('finds the asynchronous command', async () => {
    const command = getRandom()
    const wrapper = getMountedWrapper({}, getAsyncCommand(command))

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)

    expect(wrapper.findAllComponents(Stdout).at(1).text()).toBe(command)
  })

  it('executes built-in commands', async () => {
    const command = getRandom()
    const fn = jest.fn()
    const wrapper = getMountedWrapper({ builtIn: fn }, getEmptyCommands())

    wrapper.find('input').setValue(command)
    await wrapper.find('input').trigger(KEY_ENTER_EVENT)

    expect(fn).toHaveBeenCalled()
  })
})
