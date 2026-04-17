<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  cards: {
    type: Array,
    default: () => []
  },
  imageSource: {
    type: String,
    default: 'assets',
    validator: (value) => ['assets', 'props', 'auto'].includes(value)
  },
  label: {
    type: String,
    default: 'Моменты проекта'
  },
  title: {
    type: String,
    default: 'Не просто события - следы живой миссии'
  },
  lead: {
    type: String,
    default:
      'В этих кадрах отражены реальные люди, искреннее служение и атмосфера пути. Каждый момент - свидетельство того, как вера проявляется в простых, но глубоких встречах.'
  }
})

const imageModules = import.meta.glob('../../assets/moments/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default'
})

const assetImages = Object.entries(imageModules)
  .sort(([a], [b]) =>
    a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  )
  .map(([, src]) => src)

const propCardImages = computed(() => (props.cards ?? []).filter((card) => Boolean(card?.image)).map((card) => card.image))

const sourceImages = computed(() => {
  if (props.imageSource === 'props') {
    return propCardImages.value
  }

  if (props.imageSource === 'auto') {
    return propCardImages.value.length > 0 ? propCardImages.value : assetImages
  }

  if (assetImages.length > 0) {
    return assetImages
  }

  if (propCardImages.value.length > 0) {
    return propCardImages.value
  }

  return []
})

const storyMeta = Object.freeze([
  {
    title: 'Молитва перед выездом',
    location: 'Пермь - вечернее служение',
    tag: 'единство',
    description: 'Команда собирается вместе перед стартом, чтобы выровнять сердце и цель.',
    date: '15 марта 2026'
  },
  {
    title: 'Путь к людям',
    location: 'Дорога - переезд',
    tag: 'движение',
    description: 'Дорога становится временем общения, поддержки и подготовки к служению.',
    date: '15 марта 2026'
  },
  {
    title: 'Встреча с общиной',
    location: 'Местная церковь',
    tag: 'служение',
    description: 'Первая встреча, в которой рождается доверие и открываются сердца.',
    date: '16 марта 2026'
  },
  {
    title: 'Разговоры после встречи',
    location: 'После служения',
    tag: 'близость',
    description: 'Глубокие личные диалоги, где люди делятся важным и получают поддержку.',
    date: '16 марта 2026'
  },
  {
    title: 'Обучение в действии',
    location: 'Практический блок',
    tag: 'рост',
    description: 'Теория сразу превращается в практику: команда пробует, ошибается и растет.',
    date: '17 марта 2026'
  },
  {
    title: 'Музыка и поклонение',
    location: 'Командный вечер',
    tag: 'радость',
    description: 'Музыка помогает людям открыться и вместе прожить живой момент веры.',
    date: '18 марта 2026'
  },
  {
    title: 'Теплый командный быт',
    location: 'Дом команды',
    tag: 'атмосфера',
    description: 'Простые бытовые сцены, где укрепляются отношения и рождается единство.',
    date: '18 марта 2026'
  },
  {
    title: 'Финальный акцент',
    location: 'Итоговая встреча',
    tag: 'благодарность',
    description: 'Подводим итог пути, благодарим Бога и людей за пройденные шаги.',
    date: '19 марта 2026'
  }
])

const layoutPattern = Object.freeze(['hero', 'wide', 'tall', 'mid-a', 'mid-b', 'small-a', 'small-b', 'support'])

const moments = computed(() =>
  sourceImages.value.slice(0, layoutPattern.length).map((image, index) => {
    const meta = storyMeta[index % storyMeta.length]
    return {
      id: `moment-${index + 1}`,
      image,
      layout: layoutPattern[index],
      ...meta
    }
  })
)

const isViewerOpen = ref(false)
const activeIndex = ref(0)
const viewerRef = ref(null)
const closeButtonRef = ref(null)
const appRootRef = ref(null)
const lastFocusedElement = ref(null)

const activeMoment = computed(() => moments.value[activeIndex.value] ?? null)

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function rememberCurrentFocus() {
  lastFocusedElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
}

function openViewer(index) {
  if (index < 0 || index >= moments.value.length) {
    return
  }

  rememberCurrentFocus()
  activeIndex.value = index
  isViewerOpen.value = true
}

function closeViewer() {
  isViewerOpen.value = false
}

function showNext() {
  if (!moments.value.length) {
    return
  }

  activeIndex.value = (activeIndex.value + 1) % moments.value.length
}

function showPrev() {
  if (!moments.value.length) {
    return
  }

  activeIndex.value = (activeIndex.value - 1 + moments.value.length) % moments.value.length
}

function trapFocus(event) {
  if (event.key !== 'Tab' || !viewerRef.value) {
    return
  }

  const focusable = Array.from(viewerRef.value.querySelectorAll(focusableSelector)).filter(
    (el) => el instanceof HTMLElement && !el.hasAttribute('disabled')
  )

  if (!focusable.length) {
    event.preventDefault()
    closeButtonRef.value?.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function handleKeydown(event) {
  if (!isViewerOpen.value) {
    return
  }

  trapFocus(event)

  if (event.key === 'Escape') {
    event.preventDefault()
    closeViewer()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    showPrev()
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    showNext()
  }
}

watch(isViewerOpen, async (isOpen) => {
  if (isOpen) {
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)

    appRootRef.value = document.getElementById('app')
    if (appRootRef.value) {
      appRootRef.value.setAttribute('inert', '')
      appRootRef.value.setAttribute('aria-hidden', 'true')
    }

    await nextTick()
    closeButtonRef.value?.focus()
    return
  }

  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)

  if (appRootRef.value) {
    appRootRef.value.removeAttribute('inert')
    appRootRef.value.removeAttribute('aria-hidden')
  }

  if (lastFocusedElement.value && document.contains(lastFocusedElement.value)) {
    lastFocusedElement.value.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.documentElement.style.overflow = ''

  if (appRootRef.value) {
    appRootRef.value.removeAttribute('inert')
    appRootRef.value.removeAttribute('aria-hidden')
  }
})
</script>

<template>
  <section id="moments" class="moments section-block" data-block-name="moments">
    <div class="container moments-shell">
      <header class="moments-intro">
        <p class="section-kicker dark">{{ props.label }}</p>
        <h2 class="section-title moments-title">{{ props.title }}</h2>
        <p class="moments-lead">{{ props.lead }}</p>
      </header>

      <div v-if="!moments.length" class="moments-empty" role="status">Фото для этой секции скоро появятся.</div>

      <div v-else class="moments-grid" :class="{ 'is-compact': moments.length < layoutPattern.length }">
        <button
          v-for="(moment, index) in moments"
          :key="moment.id"
          type="button"
          class="moment-card"
          :class="`layout-${moment.layout}`"
          @click="openViewer(index)"
        >
          <img class="moment-image" :src="moment.image" :alt="moment.title" loading="lazy" decoding="async" />
          <span class="moment-overlay" aria-hidden="true"></span>
          <span class="moment-noise" aria-hidden="true"></span>

          <span class="moment-caption">
            <span class="moment-caption-location">{{ moment.location }}</span>
            <span class="moment-caption-title">{{ moment.title }}</span>
            <span class="moment-caption-description">{{ moment.description }}</span>
            <span class="moment-caption-tag">{{ moment.tag }}</span>
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <transition name="viewer-fade">
        <div
          v-if="isViewerOpen && activeMoment"
          ref="viewerRef"
          class="moment-viewer"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          @click.self="closeViewer"
        >
          <button
            ref="closeButtonRef"
            type="button"
            class="viewer-close"
            aria-label="Закрыть просмотр"
            @click="closeViewer"
          >
            &times;
          </button>

          <button type="button" class="viewer-nav viewer-prev" aria-label="Предыдущее фото" @click="showPrev">
            &lsaquo;
          </button>

          <figure class="viewer-media">
            <img class="viewer-image" :src="activeMoment.image" :alt="activeMoment.title" decoding="async" />
          </figure>

          <aside class="viewer-panel">
            <p class="viewer-date">{{ activeMoment.date }}</p>
            <h3 class="viewer-title">{{ activeMoment.title }}</h3>
            <p class="viewer-description">{{ activeMoment.description }}</p>
            <p class="viewer-location">{{ activeMoment.location }}</p>
            <p class="viewer-tag">#{{ activeMoment.tag }}</p>
            <p class="viewer-counter">{{ activeIndex + 1 }} / {{ moments.length }}</p>
          </aside>

          <button type="button" class="viewer-nav viewer-next" aria-label="Следующее фото" @click="showNext">
            &rsaquo;
          </button>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.moments {
  position: relative;
  overflow: hidden;
  background: var(--bg-soft);
}

.moments::before,
.moments::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
}

.moments::before {
  width: clamp(260px, 30vw, 440px);
  height: clamp(260px, 30vw, 440px);
  top: 12%;
  right: -14%;
  background: radial-gradient(circle, rgba(191, 211, 90, 0.12), rgba(191, 211, 90, 0) 72%);
}

.moments::after {
  width: clamp(280px, 32vw, 460px);
  height: clamp(280px, 32vw, 460px);
  left: -16%;
  bottom: 8%;
  background: radial-gradient(circle, rgba(255, 98, 51, 0.08), rgba(255, 98, 51, 0) 72%);
}

.moments-shell {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(18px, 2vw, 30px);
}

.moments-intro {
  max-width: 760px;
  display: grid;
  gap: 12px;
}

.moments-title {
  color: var(--text-main);
  text-wrap: balance;
  max-width: 15ch;
  line-height: 0.96;
  overflow-wrap: break-word;
}

.moments-lead {
  margin: 0;
  max-width: 62ch;
  color: var(--text-muted);
  line-height: 1.62;
  font-size: 1.03rem;
  text-wrap: pretty;
  overflow-wrap: break-word;
}

.moments-empty {
  border-radius: 14px;
  border: 1px solid rgba(16, 26, 51, 0.14);
  background: rgba(255, 255, 255, 0.8);
  color: #4b5873;
  padding: 14px 16px;
  font-weight: 600;
}

.moments-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, clamp(190px, 14.8vw, 244px));
  gap: clamp(8px, 0.75vw, 12px);
  grid-template-areas:
    'hero hero wide tall'
    'hero hero mid-a tall'
    'mid-b small-a small-b support';
}

.moments-grid.is-compact {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-template-rows: none;
  grid-template-areas: none;
  grid-auto-rows: 220px;
}

.moments-grid.is-compact .moment-card {
  grid-area: auto !important;
}

.moment-card {
  border: 0;
  width: 100%;
  padding: 0;
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  background: #0a122e;
  box-shadow: 0 18px 34px rgba(9, 18, 39, 0.22);
  transition:
    transform 0.42s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.42s ease;
}

.layout-hero {
  grid-area: hero;
}

.layout-wide {
  grid-area: wide;
}

.layout-tall {
  grid-area: tall;
}

.layout-mid-a {
  grid-area: mid-a;
}

.layout-mid-b {
  grid-area: mid-b;
}

.layout-small-a {
  grid-area: small-a;
}

.layout-small-b {
  grid-area: small-b;
}

.layout-support {
  grid-area: support;
}

.moment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  filter: saturate(0.95) contrast(0.99);
  transition: transform 0.68s cubic-bezier(0.23, 1, 0.32, 1), filter 0.4s ease;
}

.moment-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(6, 12, 30, 0.07) 22%, rgba(6, 12, 30, 0.72) 100%),
    radial-gradient(circle at 74% 16%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0) 48%);
  transition: opacity 0.34s ease;
}

.moment-noise {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.11) 0.5px, transparent 0.65px);
  background-size: 3px 3px;
  opacity: 0.14;
  pointer-events: none;
  mix-blend-mode: soft-light;
}

.moment-caption {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 12px;
  display: grid;
  gap: 5px;
  color: rgba(255, 255, 255, 0.95);
}

.moment-caption-location {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255, 255, 255, 0.72);
}

.moment-caption-title {
  font-size: clamp(0.9rem, 1.16vw, 1.2rem);
  font-weight: 700;
  line-height: 1.18;
  text-wrap: balance;
  overflow-wrap: break-word;
}

.moment-caption-description {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(8px);
  transition:
    max-height 0.35s ease,
    opacity 0.32s ease,
    transform 0.35s ease;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.88rem;
  line-height: 1.45;
  overflow-wrap: break-word;
}

.moment-caption-tag {
  width: fit-content;
  margin-top: 2px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(199, 216, 97, 0.5);
  background: rgba(7, 14, 34, 0.58);
  color: #c7d861;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.moment-card:hover,
.moment-card:focus-visible {
  transform: translateY(-5px);
  box-shadow: 0 26px 46px rgba(9, 18, 39, 0.3);
}

.moment-card:hover .moment-image,
.moment-card:focus-visible .moment-image {
  transform: scale(1.07);
  filter: saturate(1.05) contrast(1.01);
}

.moment-card:hover .moment-caption-description,
.moment-card:focus-visible .moment-caption-description {
  max-height: 96px;
  opacity: 1;
  transform: translateY(0);
}

.moment-card:focus-visible {
  outline: 2px solid rgba(17, 70, 216, 0.78);
  outline-offset: 2px;
}

.moment-viewer {
  position: fixed;
  inset: 0;
  z-index: 1200;
  padding: clamp(16px, 2.4vw, 30px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
  align-items: center;
  gap: clamp(10px, 2vw, 24px);
  background:
    radial-gradient(circle at 14% 12%, rgba(17, 70, 216, 0.22), rgba(17, 70, 216, 0) 40%),
    rgba(5, 11, 27, 0.82);
  backdrop-filter: blur(12px);
}

.viewer-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(8, 16, 38, 0.76);
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 64px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(8, 16, 38, 0.74);
  color: rgba(255, 255, 255, 0.94);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.viewer-prev {
  left: 14px;
}

.viewer-next {
  right: 14px;
}

.viewer-close:focus-visible,
.viewer-nav:focus-visible {
  outline: 2px solid rgba(191, 211, 90, 0.9);
  outline-offset: 2px;
}

.viewer-media {
  margin: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 30px 58px rgba(3, 8, 21, 0.5);
  background: rgba(4, 8, 18, 0.9);
}

.viewer-image {
  width: 100%;
  height: min(84vh, 760px);
  object-fit: contain;
}

.viewer-panel {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background:
    linear-gradient(160deg, rgba(15, 28, 62, 0.9), rgba(7, 16, 37, 0.92)),
    radial-gradient(circle at 10% 15%, rgba(191, 211, 90, 0.18), rgba(191, 211, 90, 0) 46%);
  padding: clamp(16px, 2vw, 24px);
  box-shadow: 0 22px 42px rgba(4, 9, 24, 0.34);
  color: rgba(255, 255, 255, 0.9);
  display: grid;
  gap: 10px;
}

.viewer-date {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.66);
}

.viewer-title {
  margin: 0;
  font-family: 'Dela Gothic One', sans-serif;
  font-size: clamp(1.16rem, 2.3vw, 1.72rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #f8f9ff;
}

.viewer-description {
  margin: 0;
  line-height: 1.58;
  color: rgba(255, 255, 255, 0.88);
}

.viewer-location {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
}

.viewer-tag {
  margin: 2px 0 0;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(199, 216, 97, 0.5);
  color: #c7d861;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.viewer-counter {
  margin: 8px 0 0;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.62);
}

.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1120px) {
  .moments-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(4, clamp(168px, 19vw, 220px));
    grid-template-areas:
      'hero hero wide'
      'hero hero tall'
      'mid-a mid-b tall'
      'small-a small-b support';
  }
}

@media (max-width: 900px) {
  .moments-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(6, clamp(150px, 26vw, 210px));
    grid-template-areas:
      'hero hero'
      'hero hero'
      'wide tall'
      'mid-a mid-b'
      'small-a small-b'
      'support support';
  }

  .moment-caption-description {
    max-height: 92px;
    opacity: 1;
    transform: translateY(0);
  }

  .moment-viewer {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    align-content: center;
    padding: 14px;
    gap: 10px;
  }

  .viewer-media {
    order: 1;
  }

  .viewer-panel {
    order: 2;
  }

  .viewer-nav {
    top: auto;
    bottom: 14px;
    transform: none;
    width: 44px;
    height: 44px;
  }

  .viewer-prev {
    left: 16px;
  }

  .viewer-next {
    right: 16px;
  }

  .viewer-image {
    height: min(60vh, 500px);
  }
}

@media (max-width: 640px) {
  .moments-grid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    grid-template-areas: none;
    grid-auto-rows: 220px;
  }

  .layout-hero,
  .layout-wide,
  .layout-tall,
  .layout-mid-a,
  .layout-mid-b,
  .layout-small-a,
  .layout-small-b,
  .layout-support {
    grid-area: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .moment-card,
  .moment-image,
  .moment-overlay,
  .moment-caption-description,
  .viewer-fade-enter-active,
  .viewer-fade-leave-active {
    transition: none;
  }

  .moment-card:hover,
  .moment-card:focus-visible {
    transform: none;
  }

  .moment-card:hover .moment-image,
  .moment-card:focus-visible .moment-image {
    transform: none;
  }
}
</style>

