import { mount } from '@vue/test-utils'

import VueCommand from '../../src/components/VueCommand'

export const getRandom = () => Math.random().toString(36).substring(6)

export const getEmptyCommands = () => ({ [null]: () => null })

export const getCommands = command => ({ [command]: () => command })

export const getMountedWrapper = (props, commands, slots) => mount(VueCommand, {
  propsData: { commands, ...props },
  slots
})

export const enterAndTrigger = (wrapper, value, event = 'keyup.enter') => {
  wrapper.find('input').setValue(value)
  wrapper.find('input').trigger(event)
}
