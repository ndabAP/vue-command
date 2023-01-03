// These are helpers for the package
import get from 'lodash.get'

export const PUBLISH_SYMBOL = Symbol('publish')

// Creats a new event bus to publish, subscribe and unsubscribe from events
export const newEventBus = () => {
  const events = {}
  return {
    [PUBLISH_SYMBOL] (event) {
      const callbacks = get(events, event)
      if (!callbacks) {
        return
      }

      for (const callback of callbacks) {
        callback()
      }
    },

    on (event, callback) {
      if (!events[event]) {
        events[event] = []
      }

      events[event].push(callback)
    },

    // TODO This deletes all callbacks assigned to any event
    off (event, xCallback) {
      const callbacks = get(events, event)
      if (!callbacks) {
        return
      }

      for (const [index, yCallback] of callbacks.entries()) {
        console.debug(xCallback, yCallback)
        if (xCallback === yCallback) {
          events[event].splice(index, 1)
        }
      }
    }
  }
}

export const and = (...operands) => {
  for (const operand of operands) {
    if (!operand) {
      return false
    }
  }
  return true
}

export const or = (...operands) => {
  for (const operand of operands) {
    if (operand) {
      return true
    }
  }
  return false
}
