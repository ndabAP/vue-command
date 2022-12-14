export const cycleHistory = refs => {
  refs['vueCommandWindowContent'].addEventListener('keydown', event => {
    // Bind HTML event
    switch (event.keyCode) {
      case ARROW_UP_KEY:
        break
      case ARROW_DOWN_KEY:
        break
    }

    if (terminal.local.isInProgress) {
      return
    }

    if (event.keyCode === ARROW_UP_KEY) {
      event.preventDefault()

      terminal.decreaseHistory()
    }

    if (event.keyCode === ARROW_DOWN_KEY) {
      event.preventDefault()

      terminal.increaseHistory()
    }

  })
}
