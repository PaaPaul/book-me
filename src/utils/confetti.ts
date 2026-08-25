import confetti from 'canvas-confetti'

export function fireConfetti() {
  const end = Date.now() + 3000
  const colors = ['#315f3b', '#8faa7a', '#f59e0b', '#d97706', '#f6f1e7']

  function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors,
    })

    if (Date.now() < end) {
      window.requestAnimationFrame(frame)
    }
  }

  frame()
}

export function fireEmojiConfetti() {
  const end = Date.now() + 3000
  const shapes = ['😂', '❤️', '😍', '😊', '🥰'].map((emoji) =>
    confetti.shapeFromText({ text: emoji, scalar: 2 }),
  )

  function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 70,
      origin: { x: 0 },
      scalar: 2,
      shapes,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 70,
      origin: { x: 1 },
      scalar: 2,
      shapes,
    })

    if (Date.now() < end) {
      window.requestAnimationFrame(frame)
    }
  }

  frame()
}
