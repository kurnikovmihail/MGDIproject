<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import russiaSvgRaw from '../../../assets/section-04/01-russia-map.svg?raw'
import { normalizeRegionCode } from './normalizeRegionCode'
import RussiaMapSvg from './RussiaMapSvg.vue'

const props = defineProps({
  selectedRegion: {
    type: String,
    default: null
  },
  disabledRegions: {
    type: Array,
    default: () => []
  },
  activeRegions: {
    type: Array,
    default: undefined
  },
  className: {
    type: String,
    default: ''
  },
  selectedContact: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['region-click', 'region-hover'])

const REGION_NAMES = Object.freeze({
  PER: '\u041f\u0435\u0440\u043c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439',
  VLG: '\u0412\u043e\u043b\u043e\u0433\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',
  OMS: '\u041e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c',
  KYA: '\u041a\u0440\u0430\u0441\u043d\u043e\u044f\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439'
})

const CONTACT_LABELS = Object.freeze({
  coordinator: '\u041a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u043e\u0440:',
  phone: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d:',
  vk: '\u0412\u041a:'
})
const BUBBLE_Y_OFFSET_BY_REGION = Object.freeze({
  KYA: 150
})

const hostRef = ref(null)
const hoveredRegionCode = ref(null)
const bubblePlacement = ref(null)
let resizeObserver = null

const cleanedSvg = computed(() => {
  return russiaSvgRaw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
})

const normalizedSelectedRegion = computed(() => normalizeRegionCode(props.selectedRegion))

const normalizedDisabledRegions = computed(() => {
  return new Set((props.disabledRegions ?? []).map(normalizeRegionCode).filter(Boolean))
})

const hasActiveFilter = computed(() => Array.isArray(props.activeRegions))

const normalizedActiveRegions = computed(() => {
  return new Set((props.activeRegions ?? []).map(normalizeRegionCode).filter(Boolean))
})

const selectedVkHref = computed(() => {
  const raw = props.selectedContact?.vk
  if (typeof raw !== 'string' || !raw.trim()) {
    return '#'
  }

  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
})

const selectedVkLabel = computed(() => {
  const raw = props.selectedContact?.vk
  if (typeof raw !== 'string' || !raw.trim()) {
    return 'данные уточняются'
  }

  return raw.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '')
})
const hasSelectedVk = computed(() => selectedVkHref.value !== '#')

const contactBubbleStyle = computed(() => {
  if (!bubblePlacement.value) {
    return null
  }

  return {
    left: `${bubblePlacement.value.x}px`,
    top: `${bubblePlacement.value.y}px`,
    '--contact-pointer-shift': `${bubblePlacement.value.pointerShift}px`,
    '--contact-max-width': `${bubblePlacement.value.maxWidth}px`
  }
})

function isInteractiveRegion(code) {
  if (!code) {
    return false
  }

  if (normalizedDisabledRegions.value.has(code)) {
    return false
  }

  if (!hasActiveFilter.value) {
    return true
  }

  return normalizedActiveRegions.value.has(code)
}

function getSvgElement() {
  return hostRef.value?.querySelector('svg') ?? null
}

function getRegionElementByCode(code) {
  if (!code) {
    return null
  }

  const svgElement = getSvgElement()
  if (!svgElement) {
    return null
  }

  return svgElement.querySelector(`[data-region-code="${code}"]`)
}

function getRegionElementFromTarget(target) {
  return target?.closest?.('[data-region-code]') ?? null
}

function toRegionPayload(code, fallbackName = null) {
  if (!code) {
    return null
  }

  return {
    code,
    name: REGION_NAMES[code] ?? fallbackName ?? code
  }
}

function updateContactBubblePosition() {
  const hostElement = hostRef.value
  const selectedCode = normalizedSelectedRegion.value

  if (!hostElement || !selectedCode) {
    bubblePlacement.value = null
    return
  }

  const regionElement = getRegionElementByCode(selectedCode)
  if (!regionElement) {
    bubblePlacement.value = null
    return
  }

  const hostRect = hostElement.getBoundingClientRect()
  const regionRect = regionElement.getBoundingClientRect()

  if (hostRect.width <= 0 || regionRect.width <= 0 || regionRect.height <= 0) {
    bubblePlacement.value = null
    return
  }

  const sidePadding = 14
  const availableWidth = Math.max(140, hostRect.width - sidePadding * 2)
  const bubbleMaxWidth = Math.min(340, availableWidth)
  const bubbleHalfWidth = bubbleMaxWidth / 2

  const anchorX = regionRect.left - hostRect.left + regionRect.width / 2
  const anchorY = regionRect.top - hostRect.top - 14

  const x = Math.min(
    hostRect.width - sidePadding - bubbleHalfWidth,
    Math.max(sidePadding + bubbleHalfWidth, anchorX)
  )
  const perRegionYOffset = BUBBLE_Y_OFFSET_BY_REGION[selectedCode] ?? 0
  const y = Math.max(24, anchorY + perRegionYOffset)
  const pointerShift = Math.max(
    -bubbleHalfWidth + 26,
    Math.min(bubbleHalfWidth - 26, anchorX - x)
  )

  bubblePlacement.value = {
    x,
    y,
    pointerShift,
    maxWidth: bubbleMaxWidth
  }
}

function emitRegionHover(code) {
  const normalizedCode = normalizeRegionCode(code)

  if (hoveredRegionCode.value === normalizedCode) {
    return
  }

  hoveredRegionCode.value = normalizedCode

  if (!normalizedCode) {
    emit('region-hover', null)
    return
  }

  emit('region-hover', toRegionPayload(normalizedCode))
}

function tuneSvg(svgElement) {
  svgElement.setAttribute('width', '100%')
  svgElement.setAttribute('height', '100%')
  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')

  if (!svgElement.hasAttribute('viewBox')) {
    const box = svgElement.getBBox()
    if (box.width > 0 && box.height > 0) {
      svgElement.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`)
    }
  }
}

function decorateRegions(svgElement) {
  const regionElements = svgElement.querySelectorAll('path[id^="RU-"], g[id^="RU-"]')

  regionElements.forEach((element) => {
    const code = normalizeRegionCode(element.id)
    if (!code) {
      return
    }

    const regionName = REGION_NAMES[code] ?? code

    element.dataset.regionCode = code
    element.dataset.regionName = regionName
    element.classList.add('map-base-region')
    element.setAttribute('aria-label', regionName)
  })
}

function applyRegionState() {
  const svgElement = getSvgElement()
  if (!svgElement) {
    return
  }

  const regionElements = svgElement.querySelectorAll('[data-region-code]')

  regionElements.forEach((element) => {
    const code = element.dataset.regionCode
    const isInteractive = isInteractiveRegion(code)
    const isDisabled = normalizedDisabledRegions.value.has(code)
    const isSelected = normalizedSelectedRegion.value === code
    const isHovered = hoveredRegionCode.value === code

    element.classList.toggle('map-active-region', isInteractive)
    element.classList.toggle('map-disabled-region', isDisabled)
    element.classList.toggle('map-selected-region', isSelected)
    element.classList.toggle('map-hover-region', isHovered && isInteractive)

    if (isInteractive) {
      element.setAttribute('role', 'button')
      element.setAttribute('tabindex', '0')
      element.setAttribute('aria-disabled', 'false')
    } else {
      element.removeAttribute('role')
      element.removeAttribute('tabindex')
      element.setAttribute('aria-disabled', isDisabled ? 'true' : 'false')
    }
  })

  if (hoveredRegionCode.value && !isInteractiveRegion(hoveredRegionCode.value)) {
    emitRegionHover(null)
  }

  updateContactBubblePosition()
}

function handlePointerOver(event) {
  const regionElement = getRegionElementFromTarget(event.target)
  if (!regionElement) {
    return
  }

  const code = regionElement.dataset.regionCode
  if (!isInteractiveRegion(code)) {
    return
  }

  emitRegionHover(code)
  applyRegionState()
}

function handlePointerOut(event) {
  const currentRegion = getRegionElementFromTarget(event.target)
  if (!currentRegion) {
    return
  }

  const nextRegion = getRegionElementFromTarget(event.relatedTarget)
  if (nextRegion?.dataset.regionCode === currentRegion.dataset.regionCode) {
    return
  }

  emitRegionHover(null)
  applyRegionState()
}

function handleClick(event) {
  const regionElement = getRegionElementFromTarget(event.target)
  if (!regionElement) {
    return
  }

  const code = regionElement.dataset.regionCode
  if (!isInteractiveRegion(code)) {
    return
  }

  const payload = toRegionPayload(code, regionElement.dataset.regionName)
  if (!payload) {
    return
  }

  emit('region-click', payload)
}

function handleKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  const regionElement = getRegionElementFromTarget(event.target)
  if (!regionElement) {
    return
  }

  const code = regionElement.dataset.regionCode
  if (!isInteractiveRegion(code)) {
    return
  }

  event.preventDefault()

  const payload = toRegionPayload(code, regionElement.dataset.regionName)
  if (!payload) {
    return
  }

  emit('region-click', payload)
}

function attachListeners(svgElement) {
  svgElement.addEventListener('pointerover', handlePointerOver)
  svgElement.addEventListener('pointerout', handlePointerOut)
  svgElement.addEventListener('click', handleClick)
  svgElement.addEventListener('keydown', handleKeyDown)
}

function detachListeners(svgElement) {
  svgElement.removeEventListener('pointerover', handlePointerOver)
  svgElement.removeEventListener('pointerout', handlePointerOut)
  svgElement.removeEventListener('click', handleClick)
  svgElement.removeEventListener('keydown', handleKeyDown)
}

onMounted(async () => {
  await nextTick()

  const svgElement = getSvgElement()
  if (!svgElement) {
    return
  }

  tuneSvg(svgElement)
  decorateRegions(svgElement)
  applyRegionState()
  attachListeners(svgElement)

  if ('ResizeObserver' in window && hostRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateContactBubblePosition()
    })
    resizeObserver.observe(hostRef.value)
  }

  window.addEventListener('resize', updateContactBubblePosition, { passive: true })
})

onBeforeUnmount(() => {
  const svgElement = getSvgElement()

  if (svgElement) {
    detachListeners(svgElement)
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  window.removeEventListener('resize', updateContactBubblePosition)
})

watch(
  () => [props.selectedRegion, props.disabledRegions, props.activeRegions, props.selectedContact],
  async () => {
    await nextTick()
    applyRegionState()
  },
  { deep: true }
)
</script>

<template>
  <div ref="hostRef" class="map-root" :class="className">
    <div class="map-svg-shell">
      <RussiaMapSvg :svg-markup="cleanedSvg" />
    </div>

    <Transition name="map-contact-float" mode="out-in">
      <article
        v-if="normalizedSelectedRegion && props.selectedContact && contactBubbleStyle"
        :key="normalizedSelectedRegion"
        class="map-contact-bubble"
        :style="contactBubbleStyle"
        aria-live="polite"
      >
        <p class="map-contact-region">{{ props.selectedContact.regionLabel }}</p>
        <p class="map-contact-row"><span>{{ CONTACT_LABELS.coordinator }}</span> {{ props.selectedContact.fullName }}</p>
        <p class="map-contact-row"><span>{{ CONTACT_LABELS.phone }}</span> {{ props.selectedContact.phone }}</p>
        <p class="map-contact-row">
          <span>{{ CONTACT_LABELS.vk }}</span>
          <a
            v-if="hasSelectedVk"
            class="map-contact-link"
            :href="selectedVkHref"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ selectedVkLabel }}
          </a>
          <span v-else class="map-contact-muted">{{ selectedVkLabel }}</span>
        </p>
      </article>
    </Transition>
  </div>
</template>

<style scoped>
.map-root {
  position: relative;
  inline-size: 100%;
  max-inline-size: var(--map-max-inline-size, 1100px);
  margin-inline: var(--map-margin-inline, auto);
  overflow: visible;
}

.map-svg-shell {
  clip-path: var(--map-clip-path, none);
  overflow: hidden;
}

.map-root :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

.map-root :deep(.map-base-region) {
  fill: #cbd5e1;
  stroke: rgba(150, 161, 182, 0.72);
  stroke-width: 1;
  transition: fill 0.2s ease, opacity 0.2s ease;
  cursor: default;
  outline: none;
}

.map-root :deep(.map-active-region) {
  fill: #9ca3af;
  cursor: pointer;
}

.map-root :deep(.map-active-region:hover),
.map-root :deep(.map-hover-region) {
  fill: #69758c;
}

.map-root :deep(.map-selected-region) {
  fill: var(--text-main);
}

.map-root :deep(.map-disabled-region) {
  fill: #e5e7eb;
  opacity: 0.6;
  cursor: not-allowed;
}

.map-root :deep(.map-base-region:focus-visible) {
  stroke: #0f172a;
  stroke-width: 2;
}

.map-contact-bubble {
  position: absolute;
  z-index: 8;
  transform: translate(-50%, -100%);
  inline-size: min(var(--contact-max-width, 340px), calc(100% - 20px));
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(16, 26, 51, 0.2);
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.94), rgba(246, 249, 255, 0.9)),
    rgba(255, 255, 255, 0.92);
  box-shadow:
    0 16px 34px rgba(16, 26, 51, 0.2),
    0 3px 8px rgba(16, 26, 51, 0.12);
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.map-contact-bubble::after {
  content: '';
  position: absolute;
  left: calc(50% + var(--contact-pointer-shift, 0px));
  bottom: -9px;
  inline-size: 17px;
  block-size: 17px;
  transform: translateX(-50%) rotate(45deg);
  border-right: 1px solid rgba(16, 26, 51, 0.2);
  border-bottom: 1px solid rgba(16, 26, 51, 0.2);
  background: rgba(252, 253, 255, 0.96);
}

.map-contact-region {
  margin: 0 0 7px;
  color: rgba(16, 26, 51, 0.74);
  font-size: 0.76rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.map-contact-row {
  margin: 0;
  color: var(--text-main);
  font-size: 0.94rem;
  line-height: 1.42;
}

.map-contact-row + .map-contact-row {
  margin-top: 3px;
}

.map-contact-row span {
  color: rgba(16, 26, 51, 0.82);
}

.map-contact-link {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed rgba(17, 70, 216, 0.4);
}

.map-contact-link:hover {
  border-bottom-color: rgba(17, 70, 216, 0.9);
}

.map-contact-muted {
  color: rgba(16, 26, 51, 0.6);
}

.map-contact-float-enter-active,
.map-contact-float-leave-active {
  transition:
    opacity 0.38s ease,
    transform 0.44s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.38s ease;
}

.map-contact-float-enter-from,
.map-contact-float-leave-to {
  opacity: 0;
  transform: translate(-50%, -92%) scale(0.96);
  filter: blur(5px);
}

@media (max-width: 840px) {
  .map-contact-bubble {
    padding: 12px 13px;
    border-radius: 15px;
    inline-size: min(var(--contact-max-width, 320px), calc(100% - 14px));
  }

  .map-contact-row {
    font-size: 0.86rem;
    line-height: 1.38;
  }
}
</style>
