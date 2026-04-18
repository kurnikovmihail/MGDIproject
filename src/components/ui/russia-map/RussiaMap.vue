<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import russiaSvgRaw from '../../../assets/maps/russia.svg?raw'
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
  }
})

const emit = defineEmits(['region-click', 'region-hover'])

const REGION_NAMES = Object.freeze({
  PER: 'Пермский край',
  VLG: 'Вологодская область',
  OMS: 'Омская область',
  KYA: 'Красноярский край'
})

const hostRef = ref(null)
const hoveredRegionCode = ref(null)

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
})

onBeforeUnmount(() => {
  const svgElement = getSvgElement()
  if (!svgElement) {
    return
  }

  detachListeners(svgElement)
})

watch(
  () => [props.selectedRegion, props.disabledRegions, props.activeRegions],
  () => {
    applyRegionState()
  },
  { deep: true }
)
</script>

<template>
  <div ref="hostRef" class="map-root" :class="className">
    <RussiaMapSvg :svg-markup="cleanedSvg" />
  </div>
</template>

<style scoped>
.map-root {
  inline-size: 100%;
  max-inline-size: 1100px;
  margin-inline: auto;
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
  fill: #1146d8;
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
</style>
