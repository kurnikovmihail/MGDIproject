import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useScrollEffects() {
  const isScrolled = ref(false)

  const updateScrollState = () => {
    const scrollY = window.scrollY || 0
    isScrolled.value = scrollY > 24
  }

  onMounted(() => {
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateScrollState)
  })

  return {
    isScrolled
  }
}
