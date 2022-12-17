import { mount } from '@vue/test-utils'
import VueCommand from '@/components/VueCommand.vue'
import VueCommandQuery from '@/components/VueCommandQuery.vue'

describe('VueCommand.vue', () => {
  describe('props', () => {
    it('prompt', () => {
      const wrapper = mount(VueCommand, {
        props: {
          prompt: 'TEST_PROMPT'
        }
      })
      const query = wrapper.findComponent(VueCommandQuery)
      const span = query.find('span')

      expect(span.text()).toMatch('TEST_PROMPT')
    })
  })
})
