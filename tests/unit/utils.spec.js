import {
  newEventBus,
  PUBLISH_SYMBOL
} from '../../src/utils'

describe('utils', () => {
  describe('newEventBus', () => {
    it('publishes an event', () => {
      const eventBus = newEventBus()

      const event = 'TEST_EVENT'
      const callback = jest.fn()
      eventBus.on(event, callback)
      eventBus[PUBLISH_SYMBOL](event)
      expect(callback).toHaveBeenCalled()
    })

    it('unsubscribes from an event', () => {
      const eventBus = newEventBus()

      const event = 'TEST_EVENT'
      const callback = jest.fn()
      eventBus.on(event, callback)
      eventBus.off(event, callback)
      eventBus[PUBLISH_SYMBOL](event)
      expect(callback).toHaveBeenCalledTimes(0)
    })
  })
})
