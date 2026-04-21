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

const imageModules = import.meta.glob('../../assets/section-05/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default'
})

const layoutPattern = Object.freeze(['hero', 'wide', 'tall', 'mid-a', 'mid-b', 'small-a', 'small-b', 'support'])

const fallbackMeta = Object.freeze([
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

const assetMomentConfigs = Object.freeze([
  {
    key: 'prayer',
    layout: 'hero',
    title: 'Молитва перед выездом',
    location: 'Перед стартом поездки',
    tag: 'единство',
    description: 'Команда молится перед дорогой и настраивается на служение.',
    date: 'Весна 2026',
    previewHints: ['молитва перед выездом 1']
  },
  {
    key: 'trip',
    layout: 'wide',
    title: 'Фото перед поездкой',
    location: 'Стартовый момент',
    tag: 'путь',
    description: 'Последние минуты перед выездом, когда все уже готовы двигаться.',
    date: 'Весна 2026',
    previewHints: ['фото перед поездкой']
  },
  {
    key: 'learning',
    layout: 'tall',
    title: 'Обучение',
    location: 'Учебный блок',
    tag: 'рост',
    description: 'Живое обучение, где знания сразу переходят в практику.',
    date: 'Весна 2026',
    previewHints: ['обучение']
  },
  {
    key: 'practice',
    layout: 'mid-a',
    title: 'Практика',
    location: 'Командная практика',
    tag: 'действие',
    description: 'Практические задания, совместная работа и закрепление навыков.',
    date: 'Весна 2026',
    previewHints: ['практика 2', 'практика']
  },
  {
    key: 'worship',
    layout: 'mid-b',
    title: 'Поклонение',
    location: 'Командное поклонение',
    tag: 'поклонение',
    description: 'Время единого поклонения, музыки и молитвенной глубины.',
    date: 'Весна 2026',
    previewHints: ['поклонение 1']
  },
  {
    key: 'easter',
    layout: 'small-a',
    title: 'Пасхальные моменты',
    location: 'Пасховая встреча',
    tag: 'праздник',
    description: 'Светлые кадры пасхальных дней и особой атмосферы праздника.',
    date: 'Весна 2026',
    previewHints: ['пасха 2']
  },
  {
    key: 'comfort',
    layout: 'small-b',
    title: 'Уют команды',
    location: 'Дом и команда',
    tag: 'атмосфера',
    description: 'Простые тёплые моменты, где команда становится настоящей семьёй.',
    date: 'Весна 2026',
    previewHints: ['уют в команде', 'уют дома'],
    previewObjectPosition: '50% 22%'
  },
  {
    key: 'together',
    layout: 'support',
    title: 'Время вместе',
    location: 'Начало проекта',
    tag: 'общение',
    description: 'Кадры совместного времени, с которого начинается общая история.',
    date: 'Весна 2026',
    previewHints: ['в начале проекта', 'время вместе']
  }
])

function normalizeAssetName(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/u, '')
    .replace(/^\d+\s*[-_]\s*/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
}

function detectCategoryKey(normalizedName) {
  if (normalizedName.includes('молитва перед выездом')) {
    return 'prayer'
  }

  if (normalizedName.includes('фото перед поездкой')) {
    return 'trip'
  }

  if (normalizedName.includes('обучение')) {
    return 'learning'
  }

  if (normalizedName.includes('практика')) {
    return 'practice'
  }

  if (normalizedName.includes('поклонение')) {
    return 'worship'
  }

  if (normalizedName.includes('пасха')) {
    return 'easter'
  }

  if (normalizedName.includes('уют')) {
    return 'comfort'
  }

  if (normalizedName.includes('время вместе')) {
    return 'together'
  }

  return 'other'
}

function choosePreview(entries, hints) {
  for (const hint of hints) {
    const normalizedHint = hint.toLowerCase()
    const matched = entries.find((entry) => entry.normalizedName.includes(normalizedHint))
    if (matched) {
      return matched
    }
  }

  const withoutNumericTail = entries.find((entry) => !/\s[2-9]\b/u.test(entry.normalizedName))
  return withoutNumericTail ?? entries[0]
}

const assetImageEntries = Object.entries(imageModules)
  .map(([path, src]) => {
    const fileName = decodeURIComponent(path.split('/').pop() ?? '')
    const title = fileName.replace(/\.[^.]+$/u, '').replace(/^\d+\s*[-_]\s*/u, '').trim()
    const orderMatch = fileName.match(/^(\d+)/u)

    return {
      src,
      fileName,
      title,
      normalizedName: normalizeAssetName(fileName),
      order: orderMatch ? Number(orderMatch[1]) : Number.MAX_SAFE_INTEGER
    }
  })
  .sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order
    }

    return a.fileName.localeCompare(b.fileName, 'ru', { numeric: true, sensitivity: 'base' })
  })

const groupedAssetImages = computed(() => {
  const grouped = new Map()

  for (const entry of assetImageEntries) {
    const categoryKey = detectCategoryKey(entry.normalizedName)
    if (!grouped.has(categoryKey)) {
      grouped.set(categoryKey, [])
    }

    grouped.get(categoryKey).push(entry)
  }

  return grouped
})

const categorizedAssetMoments = computed(() =>
  assetMomentConfigs
    .map((config, index) => {
      const entries = groupedAssetImages.value.get(config.key) ?? []
      if (!entries.length) {
        return null
      }

      const preview = choosePreview(entries, config.previewHints ?? [])
      const galleryEntries = [preview, ...entries.filter((entry) => entry !== preview)]
      const gallery = galleryEntries.map((entry, photoIndex) => ({
        id: `moment-${index + 1}-photo-${photoIndex + 1}`,
        src: entry.src,
        alt: `${config.title}: ${entry.title}`,
        title: entry.title
      }))

      return {
        id: `moment-${index + 1}`,
        image: preview.src,
        layout: config.layout,
        previewObjectPosition: config.previewObjectPosition ?? '',
        gallery,
        photoCount: gallery.length,
        title: config.title,
        location: config.location,
        tag: config.tag,
        description: config.description,
        date: config.date
      }
    })
    .filter(Boolean)
)

const propCardImages = computed(() => (props.cards ?? []).filter((card) => Boolean(card?.image)).map((card) => card.image))

const fallbackMoments = computed(() =>
  propCardImages.value.slice(0, layoutPattern.length).map((image, index) => {
    const meta = fallbackMeta[index % fallbackMeta.length]

    return {
      id: `moment-${index + 1}`,
      image,
      layout: layoutPattern[index],
      previewObjectPosition: '',
      gallery: [
        {
          id: `moment-${index + 1}-photo-1`,
          src: image,
          alt: meta.title,
          title: meta.title
        }
      ],
      photoCount: 1,
      ...meta
    }
  })
)

const moments = computed(() => {
  if (props.imageSource === 'props') {
    return fallbackMoments.value
  }

  if (categorizedAssetMoments.value.length > 0) {
    return categorizedAssetMoments.value
  }

  if (props.imageSource === 'auto' && fallbackMoments.value.length > 0) {
    return fallbackMoments.value
  }

  return []
})

const isViewerOpen = ref(false)
const activeMomentIndex = ref(0)
const activePhotoIndex = ref(0)
const viewerRef = ref(null)
const closeButtonRef = ref(null)
const appRootRef = ref(null)
const lastFocusedElement = ref(null)

const activeMoment = computed(() => moments.value[activeMomentIndex.value] ?? null)
const activeGallery = computed(() => activeMoment.value?.gallery ?? [])
const activePhoto = computed(() => activeGallery.value[activePhotoIndex.value] ?? activeGallery.value[0] ?? null)
const hasMultipleActivePhotos = computed(() => activeGallery.value.length > 1)
const hasMultipleMoments = computed(() => moments.value.length > 1)

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
  activeMomentIndex.value = index
  activePhotoIndex.value = 0
  isViewerOpen.value = true
}

function closeViewer() {
  isViewerOpen.value = false
}

function showNextMoment() {
  if (!moments.value.length) {
    return
  }

  activeMomentIndex.value = (activeMomentIndex.value + 1) % moments.value.length
}

function showPrevMoment() {
  if (!moments.value.length) {
    return
  }

  activeMomentIndex.value = (activeMomentIndex.value - 1 + moments.value.length) % moments.value.length
}

function setActivePhoto(index) {
  if (index < 0 || index >= activeGallery.value.length) {
    return
  }

  activePhotoIndex.value = index
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
    showPrevMoment()
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    showNextMoment()
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

watch(activeMomentIndex, () => {
  activePhotoIndex.value = 0
})

watch(moments, (nextMoments) => {
  if (!nextMoments.length) {
    activeMomentIndex.value = 0
    activePhotoIndex.value = 0
    return
  }

  if (activeMomentIndex.value > nextMoments.length - 1) {
    activeMomentIndex.value = 0
  }

  activePhotoIndex.value = 0
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
          <img
            class="moment-image"
            :src="moment.image"
            :alt="moment.title"
            :style="moment.previewObjectPosition ? { objectPosition: moment.previewObjectPosition } : undefined"
            loading="lazy"
            decoding="async"
          />
          <span class="moment-overlay" aria-hidden="true"></span>
          <span class="moment-noise" aria-hidden="true"></span>

          <span class="moment-caption">
            <span class="moment-caption-location">{{ moment.location }}</span>
            <span class="moment-caption-title">{{ moment.title }}</span>
            <span class="moment-caption-tag">{{ moment.tag }}</span>
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <transition name="viewer-fade">
        <div
          v-if="isViewerOpen && activeMoment && activePhoto"
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

          <button
            type="button"
            class="viewer-nav viewer-prev"
            :class="{ 'is-disabled': !hasMultipleMoments }"
            aria-label="Предыдущий блок"
            :disabled="!hasMultipleMoments"
            @click="showPrevMoment"
          >
            &lsaquo;
          </button>

          <figure class="viewer-media">
            <img class="viewer-image" :src="activePhoto.src" :alt="activePhoto.alt" decoding="async" />
          </figure>

          <aside class="viewer-panel">
            <p class="viewer-date">#мгди 9</p>
            <h3 class="viewer-title">{{ activeMoment.title }}</h3>
            <p class="viewer-tag">#{{ activeMoment.tag }}</p>

            <div v-if="activeGallery.length > 1" class="viewer-thumbs">
              <button
                v-for="(photo, photoIndex) in activeGallery"
                :key="photo.id"
                type="button"
                class="viewer-thumb"
                :class="{ 'is-active': photoIndex === activePhotoIndex }"
                @click="setActivePhoto(photoIndex)"
              >
                <img :src="photo.src" :alt="photo.alt" loading="lazy" decoding="async" />
              </button>
            </div>

            <p v-if="activeGallery.length > 1" class="viewer-counter">{{ activePhotoIndex + 1 }} / {{ activeGallery.length }}</p>
          </aside>

          <button
            type="button"
            class="viewer-nav viewer-next"
            :class="{ 'is-disabled': !hasMultipleMoments }"
            aria-label="Следующий блок"
            :disabled="!hasMultipleMoments"
            @click="showNextMoment"
          >
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
  line-height: 1.66;
  font-size: 1.02rem;
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
  font-size: clamp(0.94rem, 1.12vw, 1.2rem);
  font-weight: 700;
  line-height: 1.22;
  text-wrap: balance;
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
  width: 54px;
  height: 118px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background:
    linear-gradient(180deg, rgba(17, 35, 79, 0.72), rgba(8, 18, 42, 0.84)),
    rgba(8, 16, 38, 0.72);
  color: rgba(222, 231, 255, 0.9);
  font-size: 2.15rem;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(3, 8, 20, 0.42);
  transition: border-color 0.26s ease, color 0.26s ease, background 0.26s ease, transform 0.26s ease;
}

.viewer-prev {
  left: 18px;
}

.viewer-next {
  right: 18px;
}

.viewer-nav:not(:disabled):hover {
  border-color: rgba(191, 211, 90, 0.52);
  color: #eaf0ff;
  transform: translateY(-50%) scale(1.02);
}

.viewer-nav.is-disabled,
.viewer-nav:disabled {
  opacity: 0.42;
  cursor: default;
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

.viewer-thumbs {
  margin-top: 2px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(62px, 1fr));
  gap: 8px;
}

.viewer-thumb {
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(8, 16, 38, 0.58);
  border-radius: 10px;
  padding: 0;
  height: 56px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.24s ease, transform 0.24s ease;
}

.viewer-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.viewer-thumb.is-active {
  border-color: rgba(191, 211, 90, 0.92);
  transform: translateY(-1px);
}

.viewer-thumb:focus-visible {
  outline: 2px solid rgba(191, 211, 90, 0.9);
  outline-offset: 1px;
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
    width: 46px;
    height: 46px;
    font-size: 1.82rem;
  }

  .viewer-prev {
    left: 16px;
  }

  .viewer-next {
    right: 16px;
  }

  .viewer-nav:not(:disabled):hover {
    transform: scale(1.02);
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
  .viewer-thumb,
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


