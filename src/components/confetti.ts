export function triggerConfetti(rating: number) {
  const count = Math.min(rating * 12, 60)
  const colors = [
    "#d4a053",
    "#4caf7d",
    "#5b9bd5",
    "#c47a9a",
    "#e0b46e",
    "#ff6b6b",
    "#ffd93d",
    "#6bcb77",
  ]

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div")
    const size = 6 + Math.random() * 8
    const color = colors[Math.floor(Math.random() * colors.length)]
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200
    const startY = window.innerHeight / 2
    const endX = (Math.random() - 0.5) * window.innerWidth * 1.2
    const endY = window.innerHeight * (0.3 + Math.random() * 0.5)
    const rotation = Math.random() * 720 - 360
    const duration = 1200 + Math.random() * 1200
    const shape = Math.random() > 0.5 ? "50%" : "2px"

    confetti.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none;
      width: ${size}px; height: ${size}px;
      background: ${color}; border-radius: ${shape};
      left: ${startX}px; top: ${startY}px;
      opacity: 1;
      transform: translate(0, 0) rotate(0deg) scale(1);
      transition: none;
    `
    document.body.appendChild(confetti)

    requestAnimationFrame(() => {
      confetti.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.4, 1), opacity ${
        duration * 0.7
      }ms ease`
      confetti.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg) scale(0.3)`
      confetti.style.opacity = "0"
    })

    setTimeout(() => confetti.remove(), duration + 100)
  }
}
