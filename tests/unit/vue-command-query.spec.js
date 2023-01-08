import { mount } from '@vue/test-utils'
import VueCommand from '@/components/VueCommand.vue'
import VueCommandQuery from '@/components/VueCommandQuery.vue'
import {
  noop,
  wrap
} from 'lodash'
import {
  computed,
  ref
} from 'vue'

// Mock
class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

window.ResizeObserver = ResizeObserver

describe('VueCommandQuery', () => {
  it('shows multiline query', async () => {
    const vueCommandWrapper = mount(VueCommand)

    const vueCommandQueryWrapper = vueCommandWrapper.findComponent(VueCommandQuery)
    const queryRef = vueCommandQueryWrapper.find({ ref: 'queryRef' })

    queryRef.setValue('TEST_QUERY \\')
    await queryRef.trigger('keyup.enter')

    const multilineQueriesWrapper = vueCommandQueryWrapper.find({ ref: 'multilineQueryRefs' })
    expect(multilineQueriesWrapper.exists()).toBe(true)
  })
})
