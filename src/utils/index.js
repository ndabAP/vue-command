// These are helpers for the package

export const PUBLISH_SYMBOL = Symbol('publish')

// Creats a new event bus to publish, subscribe and unsubscribe from events
export const newEventBus = () => {
  const events = {}
  return {
    [PUBLISH_SYMBOL] (event) {
      const callbacks = events[event]
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

    off (event) {
      delete events[event]
    }
  }
}

export const and = (x, y) => {
  return x && y
}

export const or = (x, y) => {
  return x || y
}
