import gsap from 'gsap'

export const animateFollow = (target: HTMLElement) => {
  gsap.to(target, {
    scale: 1.1,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  })
}

export const animateCards = (target: HTMLElement) => {
  gsap.from(target, {
    opacity: 0,
    y: 50,
    duration: 0.5,
    ease: "power2.out"
  })
}

