import { mount } from '@vue/test-utils'
import VueCommand from '@/components/VueCommand.vue'
import VueCommandQuery from '@/components/VueCommandQuery.vue'

describe('VueCommand.vue', () => {
  describe('props', () => {
    it('hides the bar', () => {
      const wrapper = mount(VueCommand, {
        props: {
          hideBar: true
        }
      })

      expect(wrapper.find('.vue-command__bar').exists()).toBe(false)
    })
    it('renders the given prompt', () => {
      const prompt = 'TEST_PROMPT'
      const wrapper = mount(VueCommand, {
        props: {
          prompt
        }
      })
      const query = wrapper.findComponent(VueCommandQuery)
      const span = query.find('span')

      expect(span.text()).toMatch(prompt)
    })
  })
})
