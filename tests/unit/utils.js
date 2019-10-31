import { mount } from '@vue/test-utils'
import VueCommand from '../../src/components/VueCommand'

export const randomString = () => Math.random().toString(36).substring(6)

export const generateWrapper = props => {
  const c = randomString()
  return mount(VueCommand, {
    propsData: {
      commands: { [c]: () => c },
      ...props
    }
  })
}

export const enterAndTrigger = (wrapper, value, event = 'keyup.enter') => {
  wrapper.find('input').setValue(value)
  wrapper.find('input').trigger(event)
}
