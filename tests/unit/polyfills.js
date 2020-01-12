// Source: https://codepen.io/dgca/pen/WoJoNB
export const ResizeObserver = class ResizeObserver {
  constructor (callback) {
    this.observables = []

    this.boundCheck = this.check.bind(this)
    this.boundCheck()
    this.callback = callback
  }

  observe (element) {
    if (this.observables.some(observable => observable.el === element)) {
      return
    }

    const newObservable = {
      el: element,
      size: {
        height: element.clientHeight,
        width: element.clientWidth
      }
    }

    this.observables.push(newObservable)
  }

  unobserve (element) {
    this.observables = this.observables.filter(object => object.el !== element)
  }

  disconnect () {
    this.observables = []
  }

  check () {
    const changedEntries = this.observables
      .filter(object => {
        const currentHeight = object.el.clientHeight
        const currentWidth = object.el.clientWidth
        if (object.size.height !== currentHeight || object.size.width !== currentWidth) {
          object.size.height = currentHeight
          object.size.width = currentWidth

          return true
        }
      })
      .map(object => object.el)

    if (changedEntries.length > 0) {
      this.callback(changedEntries)
    }

    window.requestAnimationFrame(this.boundCheck)
  }
}
