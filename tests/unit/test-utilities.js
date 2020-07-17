import { mount } from '@vue/test-utils'

import VueCommand from '../../src/components/VueCommand'
import { createStdout, createDummyStdout } from '../../src/library'

export const getRandom = () => Math.random().toString(36).substring(7)

export const getEmptyCommands = () => ({ [null]: () => createDummyStdout() })
export const getCommands = command => ({ [command]: () => createStdout(command) })
export const getAsyncCommands = (command, timeout = 2000) => ({
  [command]: () => new Promise(resolve => setTimeout(resolve(createStdout(command)), timeout))
})

export const getMountedWrapper = (props, commands, slots) => mount(VueCommand, {
  propsData: { commands, ...props },
  slots
})
