import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useScrollEffects() {
  const isScrolled = ref(false)
  const parallaxShift = ref(0)

  const updateScrollState = () => {
    const scrollY = window.scrollY || 0
    isScrolled.value = scrollY > 24
    parallaxShift.value = Math.min(52, scrollY * 0.08)
  }

  onMounted(() => {
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateScrollState)
  })

  return {
    isScrolled,
    parallaxShift
  }
}
