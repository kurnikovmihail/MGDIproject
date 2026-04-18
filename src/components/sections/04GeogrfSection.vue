<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import RussiaMap from '../ui/russia-map/RussiaMap.vue'
import cityBackdropPerm from '../../assets/пермь на фонт.jpg'
import cityBackdropCherepovets from '../../assets/черепоыец на фон.jpg'
import cityBackdropOmsk from '../../assets/омск на фон.jpg'
import cityBackdropKrasnoyarsk from '../../assets/красноярск на фон.jpg'

const props = defineProps({
  label: {
    type: String,
    default: 'География'
  },
  title: {
    type: String,
    default: 'География проекта МГДИ'
  }
})

const cityBackdropByRegion = Object.freeze({
  PER: cityBackdropPerm,
  VLG: cityBackdropCherepovets,
  OMS: cityBackdropOmsk,
  KYA: cityBackdropKrasnoyarsk
})
const cityBackdropSources = Object.freeze([
  cityBackdropPerm,
  cityBackdropCherepovets,
  cityBackdropOmsk,
  cityBackdropKrasnoyarsk
])

const activeRegions = Object.freeze(['PER', 'VLG', 'OMS', 'KYA'])
const selectedRegion = ref('PER')
const sectionRef = ref(null)
const isLive = ref(false)
let observer = null
const selectedCityPhoto = computed(() => {
  const regionCode = selectedRegion.value || 'PER'
  return cityBackdropByRegion[regionCode] ?? cityBackdropPerm
})

function handleRegionClick(region) {
  selectedRegion.value = region.code
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isLive.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry || !entry.isIntersecting) {
        return
      }

      isLive.value = true
      observer.disconnect()
      observer = null
    },
    {
      threshold: 0.24
    }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <section
    id="4geogrf"
    ref="sectionRef"
    class="geo section-block"
    data-block-name="4geogrf"
    :class="{ 'is-live': isLive }"
  >
    <div class="geo-city-backdrop" aria-hidden="true">
      <img class="geo-city-backdrop-image" :src="selectedCityPhoto" alt="" loading="lazy" />
    </div>

    <div class="geo-city-preload" aria-hidden="true">
      <img v-for="src in cityBackdropSources" :key="src" :src="src" alt="" />
    </div>

    <div class="container geo-shell">
      <p class="section-kicker dark geo-kicker">{{ props.label }}</p>
      <h2 class="section-title geo-title">{{ props.title }}</h2>

      <div class="geo-layout">
        <div class="geo-map-card">
          <RussiaMap
            class-name="geo-map"
            :selected-region="selectedRegion"
            :active-regions="activeRegions"
            @region-click="handleRegionClick"
          />

          <div class="geo-map-legend" aria-label="Обозначения карты">
            <span class="geo-map-legend-item">
              <span class="geo-map-legend-dot is-active" aria-hidden="true"></span>
              Города проекта
            </span>
            <span class="geo-map-legend-item">
              <span class="geo-map-legend-dot is-selected" aria-hidden="true"></span>
              Выбранный регион
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.geo {
  position: relative;
  overflow: hidden;
  background-color: #d9dee7;
}

.geo-city-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.geo-city-backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(226, 231, 240, 0.24) 0%,
    rgba(226, 231, 240, 0.1) 38%,
    rgba(226, 231, 240, 0.26) 100%
  );
}

.geo-city-backdrop-image {
  position: absolute;
  inset: -3%;
  width: 106%;
  height: 106%;
  object-fit: cover;
  object-position: center;
  opacity: 0.82;
  transform: scale(1.03);
  filter: grayscale(1) saturate(0) contrast(1.16) brightness(0.97);
}

.geo-city-preload {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  inset: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.geo-city-preload img {
  inline-size: 1px;
  block-size: 1px;
}

.geo::before,
.geo::after {
  content: '';
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  pointer-events: none;
  opacity: 0;
}

.geo::before {
  width: clamp(300px, 30vw, 460px);
  height: clamp(300px, 30vw, 460px);
  top: 16%;
  right: -14%;
  background: radial-gradient(circle, rgba(255, 98, 51, 0.1), rgba(255, 98, 51, 0) 74%);
}

.geo::after {
  width: clamp(240px, 24vw, 360px);
  height: clamp(240px, 24vw, 360px);
  left: -10%;
  bottom: 18%;
  background: radial-gradient(circle, rgba(191, 211, 90, 0.12), rgba(191, 211, 90, 0) 74%);
}

.geo-shell {
  position: relative;
  z-index: 1;
}

.geo-shell::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(17, 70, 216, 0), rgba(17, 70, 216, 0.34), rgba(17, 70, 216, 0));
}

.geo-kicker {
  letter-spacing: 0.34em;
  color: var(--primary);
}

.geo-title {
  margin-bottom: clamp(14px, 1.8vw, 22px);
  max-width: 880px;
  color: var(--primary);
  text-wrap: balance;
}

.geo-layout {
  margin-top: clamp(8px, 1.2vw, 14px);
  display: block;
}

.geo-map-card {
  position: relative;
  border-radius: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;
  will-change: auto;
  transition: none;
}

.geo-map {
  width: 100%;
  --map-max-inline-size: 1180px;
  --map-margin-inline: auto 0;
  --map-clip-path: inset(20% 0 0 0);
}

.geo-map-legend {
  margin-top: clamp(10px, 1.3vw, 14px);
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
}

.geo-map-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: 999px;
  border: 1px solid rgba(16, 26, 51, 0.14);
  background: rgba(255, 255, 255, 0.72);
  padding: 5px 10px;
  color: var(--primary);
  font-size: 0.72rem;
  letter-spacing: 0.02em;
  line-height: 1.2;
  font-weight: 600;
}

.geo-map-legend-dot {
  inline-size: 9px;
  block-size: 9px;
  border-radius: 999px;
  border: 1.8px solid rgba(12, 14, 20, 0.95);
  background: transparent;
  box-shadow: none;
}

.geo-map-legend-dot.is-active {
  background: transparent;
  border-color: rgba(12, 14, 20, 0.95);
}

.geo-map-legend-dot.is-selected {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(12, 14, 20, 0.98);
}

.geo-map-card:hover {
  transform: none;
  box-shadow: none;
}
.geo-map-card {
  opacity: 0;
  transform: translateY(16px);
}

.geo.is-live .geo-map-card {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.48s ease,
    transform 0.58s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (max-width: 980px) {
  .geo::before {
    top: 22%;
    right: -22%;
  }

  .geo::after {
    left: -24%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .geo-map-card {
    transition: none;
  }

  .geo-map-card:hover {
    transform: none;
  }

  .geo-city-backdrop-image {
    transform: none;
  }

}
</style>
