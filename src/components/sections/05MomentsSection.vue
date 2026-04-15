<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import featuredPoster from '../../assets/service-video-poster.jpg'

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
    default: 'Не просто события — следы живой миссии'
  },
  lead: {
    type: String,
    default:
      'Кадры, в которых видно путь команды: подготовка, служение, живые встречи и теплые финалы, после которых хочется идти дальше.'
  }
})

const sectionRef = ref(null)
const viewerRef = ref(null)
const closeButtonRef = ref(null)
const appRootRef = ref(null)

const isRevealed = ref(true)
const focusedId = ref(null)
const isViewerOpen = ref(false)
const activeIndex = ref(0)
const touchStartX = ref(null)

const lastFocusedElement = ref(null)

let wheelCooldown = null

const imageModules = import.meta.glob('../../assets/moments/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default'
})

const assetImages = Object.entries(imageModules)
  .sort(([pathA], [pathB]) =>
    pathA.localeCompare(pathB, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  )
  .map(([, src]) => src)

const storyMeta = Object.freeze([
  {
    title: 'Сбор перед выездом',
    location: 'Пермь',
    stage: 'подготовка',
    mood: 'единство',
    story: 'Начинаем с молитвы и общих договоренностей, чтобы каждый чувствовал общую цель команды.'
  },
  {
    title: 'Путь команды',
    location: 'В дороге',
    stage: 'сбор',
    mood: 'ожидание',
    story: 'Поездки собирают сердца в одно направление: мы едем служить людям и поддерживать друг друга.'
  },
  {
    title: 'Музыка в служении',
    location: 'Вечерняя встреча',
    stage: 'действие',
    mood: 'радость',
    story: 'Через простые песни и открытые сердца рождается атмосфера, где людям легче услышать главное.'
  },
  {
    title: 'Разговоры по-настоящему',
    location: 'После встречи',
    stage: 'общение',
    mood: 'доверие',
    story: 'Самые важные моменты часто происходят в тихих диалогах, когда можно поделиться личным опытом.'
  },
  {
    title: 'Служение на местах',
    location: 'Городские площадки',
    stage: 'практика',
    mood: 'смелость',
    story: 'Команда выходит за привычные рамки: поддерживаем людей в городе и учимся служить делом.'
  },
  {
    title: 'Наставники рядом',
    location: 'Учебный блок',
    stage: 'обучение',
    mood: 'рост',
    story: 'Каждый получает поддержку и обратную связь, чтобы уверенно делать следующий шаг в служении.'
  },
  {
    title: 'Молитва в конце дня',
    location: 'Дом команды',
    stage: 'рефлексия',
    mood: 'покой',
    story: 'Подводим итоги дня и благодарим Бога за людей, встречи и новые возможности для служения.'
  },
  {
    title: 'Новые друзья',
    location: 'Командный круг',
    stage: 'сообщество',
    mood: 'близость',
    story: 'В проекте формируются настоящие связи, которые поддерживают и после завершения смены.'
  },
  {
    title: 'Финальный акцент',
    location: 'Общий зал',
    stage: 'итог',
    mood: 'свет',
    story: 'Финальные встречи показывают, как маленькие шаги складываются в заметные изменения вокруг.'
  }
])

const layoutOrder = Object.freeze([
  'hero',
  'support-a',
  'support-b',
  'support-c',
  'context-a',
  'context-b',
  'context-c',
  'context-d',
  'context-e'
])
const heroReplacementIndex = 4
const heroPreferredToken = 'IMG_0354'

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

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

const allMoments = computed(() =>
  sourceImages.value.map((image, index) => {
    const preset = storyMeta[index % storyMeta.length]

    return {
      id: `moment-${index + 1}`,
      image,
      title: preset.title,
      location: preset.location,
      stage: preset.stage,
      mood: preset.mood,
      story: preset.story
    }
  })
)

const orderedMoments = computed(() => {
  if (allMoments.value.length <= 1) {
    return allMoments.value
  }

  const preferredByTokenIndex = allMoments.value.findIndex((moment) => moment.image.includes(heroPreferredToken))
  const normalizedHeroIndex =
    preferredByTokenIndex >= 0 ? preferredByTokenIndex : Math.min(heroReplacementIndex, allMoments.value.length - 1)
  const moments = [...allMoments.value]
  const [heroMoment] = moments.splice(normalizedHeroIndex, 1)

  if (!heroMoment) {
    return allMoments.value
  }

  return [
    {
      ...heroMoment,
      image: featuredPoster
    },
    ...moments
  ]
})

const featuredMoments = computed(() =>
  orderedMoments.value.slice(0, layoutOrder.length).map((moment, index) => ({
    ...moment,
    layout: layoutOrder[index],
    delay: `${index * 72}ms`
  }))
)

const railMoments = computed(() => orderedMoments.value.slice(layoutOrder.length))
const loopMoments = computed(() =>
  railMoments.value.length > 0 ? [...railMoments.value, ...railMoments.value] : []
)
const activeMoment = computed(() => orderedMoments.value[activeIndex.value] ?? null)
const viewerTitleId = computed(() => (activeMoment.value ? `${activeMoment.value.id}-viewer-title` : 'moment-viewer-title'))
const viewerDescriptionId = computed(() =>
  activeMoment.value ? `${activeMoment.value.id}-viewer-description` : 'moment-viewer-description'
)

function setFocused(momentId) {
  focusedId.value = momentId
}

function clearFocused() {
  focusedId.value = null
}

function rememberCurrentFocus() {
  lastFocusedElement.value = document.activeElement instanceof HTMLElement ? document.activeElement : null
}

function openViewerAt(index) {
  if (index < 0 || index >= orderedMoments.value.length) {
    return
  }

  rememberCurrentFocus()
  activeIndex.value = index
  isViewerOpen.value = true
}

function openViewer(momentId) {
  const nextIndex = orderedMoments.value.findIndex((moment) => moment.id === momentId)
  openViewerAt(nextIndex)
}

function openByIndex(index) {
  openViewerAt(index)
}

function closeViewer() {
  isViewerOpen.value = false
}

function showPrev() {
  if (!orderedMoments.value.length) {
    return
  }

  activeIndex.value = (activeIndex.value - 1 + orderedMoments.value.length) % orderedMoments.value.length
}

function showNext() {
  if (!orderedMoments.value.length) {
    return
  }

  activeIndex.value = (activeIndex.value + 1) % orderedMoments.value.length
}

function trapFocus(event) {
  if (event.key !== 'Tab' || !viewerRef.value) {
    return
  }

  const focusableElements = Array.from(viewerRef.value.querySelectorAll(focusableSelector)).filter(
    (element) => element instanceof HTMLElement && !element.hasAttribute('disabled')
  )

  if (focusableElements.length === 0) {
    event.preventDefault()
    closeButtonRef.value?.focus()
    return
  }

  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]

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

function handleViewerWheel(event) {
  if (!isViewerOpen.value || Math.abs(event.deltaY) < 28 || wheelCooldown) {
    return
  }

  if (event.deltaY > 0) {
    showNext()
  } else {
    showPrev()
  }

  wheelCooldown = window.setTimeout(() => {
    wheelCooldown = null
  }, 360)
}

function handleTouchStart(event) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? null
}

function handleTouchEnd(event) {
  if (touchStartX.value === null) {
    return
  }

  const endX = event.changedTouches[0]?.clientX
  if (typeof endX !== 'number') {
    touchStartX.value = null
    return
  }

  const deltaX = endX - touchStartX.value
  if (Math.abs(deltaX) > 46) {
    if (deltaX < 0) {
      showNext()
    } else {
      showPrev()
    }
  }

  touchStartX.value = null
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

  if (wheelCooldown) {
    window.clearTimeout(wheelCooldown)
    wheelCooldown = null
  }

  if (appRootRef.value) {
    appRootRef.value.removeAttribute('inert')
    appRootRef.value.removeAttribute('aria-hidden')
  }

  document.documentElement.style.overflow = ''
})
</script>

<template>
  <section
    id="moments"
    ref="sectionRef"
    class="moments section-block"
    data-block-name="moments"
    :class="{ 'is-revealed': isRevealed }"
  >
    <div class="container moments-shell">
      <header class="moments-intro">
        <p class="section-kicker dark">{{ props.label }}</p>
        <h2 class="section-title moments-title">{{ props.title }}</h2>
        <p class="moments-lead">{{ props.lead }}</p>
      </header>

      <div v-if="!featuredMoments.length" class="moments-state moments-empty" role="status">
        Фото для этой секции скоро появятся.
      </div>

      <div v-else class="moments-stage" :class="{ 'is-focused': focusedId !== null }">
        <article
          v-for="moment in featuredMoments"
          :key="moment.id"
          class="moment-card"
          :class="[`moment-${moment.layout}`, { 'is-active': focusedId === moment.id }]"
          :style="{ '--moment-delay': moment.delay }"
        >
          <button
            type="button"
            class="moment-hit"
            @mouseenter="setFocused(moment.id)"
            @mouseleave="clearFocused"
            @focus="setFocused(moment.id)"
            @blur="clearFocused"
            @click="openViewer(moment.id)"
          >
            <img class="moment-image" :src="moment.image" :alt="moment.title" loading="lazy" decoding="async" />
            <span class="moment-overlay" aria-hidden="true"></span>
            <span class="moment-noise" aria-hidden="true"></span>
            <span class="moment-caption">
              <span class="moment-caption-title">{{ moment.title }}</span>
              <span class="moment-caption-meta">{{ moment.location }} · {{ moment.stage }}</span>
              <span class="moment-caption-tag">{{ moment.mood }}</span>
            </span>
          </button>
        </article>
      </div>

      <div v-if="railMoments.length" class="moments-loop-shell" aria-label="Лента дополнительных фото">
        <p class="moments-loop-hint">Подборка кадров</p>
        <div class="moments-loop">
          <div class="moments-loop-track">
            <button
              v-for="(moment, index) in loopMoments"
              :key="`${moment.id}-${index}`"
              type="button"
              class="loop-item"
              @click="openByIndex((index % railMoments.length) + featuredMoments.length)"
            >
              <img class="loop-image" :src="moment.image" :alt="moment.title" loading="lazy" decoding="async" />
              <span class="loop-overlay" aria-hidden="true"></span>
              <span class="loop-title">{{ moment.title }}</span>
            </button>
          </div>
        </div>
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
          :aria-labelledby="viewerTitleId"
          :aria-describedby="viewerDescriptionId"
          @click.self="closeViewer"
          @wheel.prevent="handleViewerWheel"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <button
            ref="closeButtonRef"
            type="button"
            class="viewer-close"
            aria-label="Закрыть просмотр"
            @click="closeViewer"
          >
            ×
          </button>

          <button type="button" class="viewer-nav viewer-nav-prev" aria-label="Предыдущее фото" @click="showPrev">
            ‹
          </button>

          <figure class="viewer-media">
            <img class="viewer-image" :src="activeMoment.image" :alt="activeMoment.title" decoding="async" />
          </figure>

          <aside class="viewer-panel">
            <p class="viewer-kicker">{{ activeMoment.location }} · {{ activeMoment.stage }}</p>
            <h3 :id="viewerTitleId" class="viewer-title">{{ activeMoment.title }}</h3>
            <p :id="viewerDescriptionId" class="viewer-story">{{ activeMoment.story }}</p>
            <p class="viewer-tag">#{{ activeMoment.mood }}</p>
            <p class="viewer-counter">{{ activeIndex + 1 }} / {{ orderedMoments.length }}</p>
          </aside>

          <button type="button" class="viewer-nav viewer-nav-next" aria-label="Следующее фото" @click="showNext">
            ›
          </button>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
.moments {
  --moments-bg: var(--bg-soft);
  --moments-surface: var(--bg-ink);
  --moments-title: var(--text-main);
  --moments-lead: var(--text-muted);

  position: relative;
  overflow: hidden;
  background: var(--moments-bg);
}

.moments::before,
.moments::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
}

.moments::before {
  width: clamp(240px, 28vw, 420px);
  height: clamp(240px, 28vw, 420px);
  top: 14%;
  right: -14%;
  background: radial-gradient(circle, rgba(191, 211, 90, 0.12), rgba(191, 211, 90, 0) 70%);
}

.moments::after {
  width: clamp(280px, 32vw, 460px);
  height: clamp(280px, 32vw, 460px);
  left: -18%;
  bottom: 10%;
  background: radial-gradient(circle, rgba(255, 98, 51, 0.08), rgba(255, 98, 51, 0) 72%);
}

.moments-shell {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(14px, 1.8vw, 24px);
}

.moments-intro {
  max-width: 760px;
  display: grid;
  gap: 12px;
  margin-bottom: 0;
}

.moments-title {
  color: var(--moments-title);
  text-wrap: balance;
}

.moments-lead {
  margin: 0;
  max-width: 68ch;
  color: var(--moments-lead);
  line-height: 1.62;
  font-size: 1.03rem;
  text-wrap: pretty;
}

.moments-state {
  border-radius: 14px;
  border: 1px solid rgba(16, 26, 51, 0.14);
  padding: 14px 16px;
  font-weight: 600;
}

.moments-empty {
  color: #4b5873;
  background: rgba(255, 255, 255, 0.8);
}

.moments-stage {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: repeat(6, minmax(0, 1fr));
  gap: clamp(8px, 0.9vw, 12px);
  height: clamp(340px, 38vw, 520px);
  align-items: stretch;
  align-content: start;
  grid-template-areas:
    'hero hero hero hero hero support-a support-a support-a support-b support-b support-b support-b'
    'hero hero hero hero hero support-a support-a support-a support-b support-b support-b support-b'
    'hero hero hero hero hero support-c support-c support-c support-b support-b support-b support-b'
    'context-a context-a context-b context-b context-b context-b support-c support-c support-c context-c context-c context-c'
    'context-a context-a context-b context-b context-b context-b context-d context-d context-d context-c context-c context-c'
    'context-e context-e context-e context-e context-e context-e context-d context-d context-d context-d context-d context-d';
}

.moment-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 0;
  opacity: 1;
  transform: none;
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.55s ease,
    filter 0.4s ease;
  transition-delay: var(--moment-delay, 0ms);
}

.moments.is-revealed .moment-card {
  opacity: 1;
  transform: none;
}

.moment-hero {
  grid-area: hero;
  min-height: 0;
}

.moment-support-a {
  grid-area: support-a;
}

.moment-support-b {
  grid-area: support-b;
}

.moment-support-c {
  grid-area: support-c;
}

.moment-context-a {
  grid-area: context-a;
}

.moment-context-b {
  grid-area: context-b;
}

.moment-context-c {
  grid-area: context-c;
}

.moment-context-d {
  grid-area: context-d;
}

.moment-context-e {
  grid-area: context-e;
}

.moment-hit {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: inherit;
  display: block;
  position: relative;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  text-align: left;
  background: var(--moments-surface);
  box-shadow: 0 16px 30px rgba(12, 22, 44, 0.18);
  transform: translate3d(0, 0, 0);
  transition:
    transform 0.45s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.45s ease,
    opacity 0.35s ease;
}

.moment-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), filter 0.45s ease;
  filter: saturate(0.95) contrast(0.98);
}

.moment-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 10, 24, 0.04) 24%, rgba(5, 10, 24, 0.64) 100%),
    radial-gradient(circle at 72% 12%, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 52%);
  transition: opacity 0.45s ease;
}

.moment-noise {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 0.5px, transparent 0.6px);
  background-size: 3px 3px;
  mix-blend-mode: soft-light;
  opacity: 0.16;
  pointer-events: none;
}

.moment-caption {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 12px;
  display: grid;
  gap: 4px;
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(14px);
  opacity: 0;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease;
}

.moment-caption-title {
  font-weight: 700;
  font-size: clamp(0.9rem, 1.1vw, 1.08rem);
  line-height: 1.22;
}

.moment-caption-meta {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.82);
}

.moment-caption-tag {
  display: inline-flex;
  width: fit-content;
  margin-top: 2px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c7d861;
  background: rgba(5, 12, 30, 0.52);
  border: 1px solid rgba(199, 216, 97, 0.44);
}

.moment-hit:hover,
.moment-hit:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 24px 44px rgba(10, 18, 37, 0.28);
}

.moment-hit:hover .moment-image,
.moment-hit:focus-visible .moment-image,
.moment-card.is-active .moment-image {
  transform: scale(1.08);
  filter: saturate(1.06) contrast(1.02);
}

.moment-hit:hover .moment-caption,
.moment-hit:focus-visible .moment-caption,
.moment-card.is-active .moment-caption {
  opacity: 1;
  transform: translateY(0);
}

.moment-hit:hover .moment-overlay,
.moment-hit:focus-visible .moment-overlay,
.moment-card.is-active .moment-overlay {
  opacity: 0.82;
}

.moment-hit:focus-visible {
  outline: 2px solid rgba(17, 70, 216, 0.78);
  outline-offset: 2px;
}

.moments-stage.is-focused .moment-card:not(.is-active) .moment-hit {
  opacity: 0.56;
}

.moments-loop-shell {
  margin-top: clamp(10px, 1.2vw, 18px);
  width: calc(100% + clamp(24px, 4vw, 64px));
  margin-left: calc(-1 * clamp(12px, 2vw, 32px));
}

.moments-loop-hint {
  margin: 0 0 8px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #516081;
}

.moments-loop {
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
}

.moments-loop-track {
  --loop-gap: 14px;
  width: max-content;
  display: flex;
  align-items: stretch;
  gap: var(--loop-gap);
  padding: 4px 0;
  animation: moments-loop-spin 84s linear infinite;
  will-change: transform;
}

.moments-loop:hover .moments-loop-track {
  animation-play-state: paused;
}

.moments-loop:focus-within .moments-loop-track {
  animation-play-state: paused;
}

.loop-item {
  position: relative;
  width: clamp(138px, 14vw, 190px);
  aspect-ratio: 4 / 3;
  border: 0;
  padding: 0;
  border-radius: 14px;
  overflow: hidden;
  background: var(--moments-surface);
  box-shadow: 0 14px 28px rgba(8, 16, 33, 0.22);
  cursor: pointer;
  flex: 0 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.loop-item:hover,
.loop-item:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 20px 36px rgba(8, 16, 33, 0.28);
}

.loop-item:focus-visible {
  outline: 2px solid rgba(17, 70, 216, 0.72);
  outline-offset: 2px;
}

.loop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 10, 24, 0) 36%, rgba(5, 10, 24, 0.64) 100%);
}

.loop-title {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 8px;
  color: rgba(255, 255, 255, 0.94);
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.24;
  text-wrap: balance;
}

.moment-viewer {
  position: fixed;
  inset: 0;
  z-index: 1200;
  padding: clamp(18px, 3vw, 34px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 330px);
  align-items: center;
  gap: clamp(12px, 2vw, 24px);
  background:
    radial-gradient(circle at 16% 12%, rgba(17, 70, 216, 0.2), rgba(17, 70, 216, 0) 40%),
    rgba(6, 12, 28, 0.72);
  backdrop-filter: blur(10px);
}

.viewer-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(10, 18, 40, 0.75);
  color: rgba(255, 255, 255, 0.94);
  font-size: 1.45rem;
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
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(9, 18, 39, 0.74);
  color: rgba(255, 255, 255, 0.94);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
}

.viewer-nav-prev {
  left: 16px;
}

.viewer-nav-next {
  right: 16px;
}

.viewer-close:focus-visible,
.viewer-nav:focus-visible {
  outline: 2px solid rgba(191, 211, 90, 0.86);
  outline-offset: 2px;
}

.viewer-media {
  margin: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 34px 64px rgba(3, 8, 21, 0.48);
  min-height: min(82vh, 760px);
  background: rgba(4, 7, 18, 0.86);
}

.viewer-image {
  width: 100%;
  height: min(82vh, 760px);
  object-fit: contain;
}

.viewer-panel {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background:
    linear-gradient(160deg, rgba(15, 28, 62, 0.9), rgba(7, 16, 37, 0.92)),
    radial-gradient(circle at 12% 18%, rgba(191, 211, 90, 0.18), rgba(191, 211, 90, 0) 48%);
  box-shadow: 0 24px 40px rgba(4, 9, 24, 0.36);
  padding: clamp(16px, 2vw, 24px);
  color: rgba(255, 255, 255, 0.9);
  display: grid;
  gap: 10px;
}

.viewer-kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.72);
}

.viewer-title {
  margin: 0;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.06;
  font-size: clamp(1.2rem, 2.3vw, 1.72rem);
  color: #f8f9ff;
}

.viewer-story {
  margin: 0;
  line-height: 1.62;
  color: rgba(255, 255, 255, 0.88);
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
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.84rem;
}

.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.28s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1120px) {
  .moments-stage {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    grid-template-rows: repeat(8, minmax(0, 1fr));
    height: clamp(420px, 64vw, 620px);
    grid-template-areas:
      'hero hero hero hero hero support-a support-a support-a'
      'hero hero hero hero hero support-a support-a support-a'
      'hero hero hero hero hero support-b support-b support-b'
      'support-c support-c support-c support-c support-b support-b support-b support-b'
      'context-a context-a context-b context-b context-b context-c context-c context-c'
      'context-a context-a context-b context-b context-b context-c context-c context-c'
      'context-d context-d context-d context-d context-d context-e context-e context-e'
      'context-d context-d context-d context-d context-d context-e context-e context-e';
  }

  .viewer-nav-prev {
    left: 10px;
  }

  .viewer-nav-next {
    right: 10px;
  }
}

@media (max-width: 900px) {
  .moments-intro {
    margin-bottom: 0;
    gap: 10px;
  }

  .moments-stage {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: none;
    grid-auto-rows: minmax(102px, auto);
    height: auto;
    grid-template-areas:
      'hero hero'
      'support-a support-b'
      'support-c context-a'
      'context-b context-c'
      'context-d context-e';
  }

  .moment-hero {
    min-height: 192px;
  }

  .moments-loop-shell {
    width: calc(100% + 28px);
    margin-left: -14px;
  }

  .moments-loop-track {
    --loop-gap: 10px;
    animation-duration: 72s;
  }

  .loop-item {
    width: min(152px, 44vw);
  }

  .moment-viewer {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    align-content: center;
    padding: 16px;
    gap: 10px;
    backdrop-filter: blur(6px);
  }

  .viewer-media {
    min-height: min(62vh, 520px);
  }

  .viewer-image {
    height: min(62vh, 520px);
  }

  .viewer-panel {
    order: 3;
  }

  .viewer-nav {
    top: auto;
    bottom: 18px;
    transform: none;
    width: 44px;
    height: 44px;
  }

  .viewer-nav-prev {
    left: 16px;
  }

  .viewer-nav-next {
    right: 16px;
  }
}

@media (max-width: 640px) {
  .moments-stage {
    grid-template-columns: 1fr;
    grid-template-areas:
      'hero'
      'support-a'
      'support-b'
      'support-c'
      'context-a'
      'context-b'
      'context-c'
      'context-d'
      'context-e';
  }

  .moment-card {
    min-height: 170px;
  }

  .moment-hero {
    min-height: 220px;
  }

  .moment-caption-title {
    font-size: 0.98rem;
  }

  .moment-caption-meta {
    font-size: 0.7rem;
  }

  .moment-viewer {
    backdrop-filter: blur(0);
  }

  .moments-loop-shell {
    width: calc(100% + 20px);
    margin-left: -10px;
  }

  .moments-loop-track {
    animation-duration: 64s;
  }

  .loop-item {
    width: min(138px, 58vw);
  }
}

@media (hover: none) {
  .moments-stage.is-focused .moment-card:not(.is-active) .moment-hit {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .moment-card,
  .moment-hit,
  .moment-image,
  .moment-overlay,
  .moment-caption,
  .loop-item,
  .viewer-fade-enter-active,
  .viewer-fade-leave-active {
    transition: none;
  }

  .moment-hit:hover,
  .moment-hit:focus-visible {
    transform: none;
  }

  .moment-hit:hover .moment-image,
  .moment-hit:focus-visible .moment-image,
  .moment-card.is-active .moment-image {
    transform: none;
  }

  .moments-loop-track {
    animation: none;
  }
}

@keyframes moments-loop-spin {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>

