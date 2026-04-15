<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import RussiaMap from '../ui/russia-map/RussiaMap.vue'

const props = defineProps({
  label: {
    type: String,
    default: 'География'
  },
  title: {
    type: String,
    default: 'География проекта МГДИ'
  },
  description: {
    type: String,
    default: 'Кликни по региону на карте или выбери город из списка справа.'
  },
  ctaText: {
    type: String,
    default: 'Открыть проект в новом регионе'
  },
  ctaUrl: {
    type: String,
    default: '#final'
  }
})

const cities = Object.freeze([
  {
    id: 'cherepovets',
    name: 'Череповец',
    regionCode: 'VLG',
    regionName: 'Вологодская область'
  },
  {
    id: 'perm',
    name: 'Пермь',
    regionCode: 'PER',
    regionName: 'Пермский край'
  },
  {
    id: 'omsk',
    name: 'Омск',
    regionCode: 'OMS',
    regionName: 'Омская область'
  },
  {
    id: 'krasnoyarsk',
    name: 'Красноярск',
    regionCode: 'KYA',
    regionName: 'Красноярский край'
  }
])

const selectedRegion = ref('PER')
const hoveredRegion = ref(null)
const sectionRef = ref(null)
const isLive = ref(false)
let observer = null

const activeRegions = computed(() => [...new Set(cities.map((city) => city.regionCode))])

const cityByRegion = computed(() => {
  return Object.fromEntries(cities.map((city) => [city.regionCode, city]))
})

const selectedCity = computed(() => cityByRegion.value[selectedRegion.value] ?? null)

const currentRegion = computed(() => {
  if (hoveredRegion.value) {
    return hoveredRegion.value
  }

  if (selectedCity.value) {
    return {
      code: selectedCity.value.regionCode,
      name: selectedCity.value.regionName
    }
  }

  return null
})

const geoFacts = computed(() => [
  {
    value: cities.length,
    label: 'городов'
  },
  {
    value: activeRegions.value.length,
    label: 'региона'
  },
  {
    value: selectedCity.value?.name ?? '—',
    label: 'в фокусе'
  }
])

function handleRegionClick(region) {
  selectedRegion.value = region.code

  console.info('[map_city_click]', {
    city: cityByRegion.value[region.code]?.name ?? null,
    region: region.name,
    code: region.code
  })
}

function handleRegionHover(region) {
  hoveredRegion.value = region
}

function selectCity(city) {
  selectedRegion.value = city.regionCode
}

function highlightCity(city) {
  hoveredRegion.value = {
    code: city.regionCode,
    name: city.regionName
  }
}

function clearCityHighlight() {
  hoveredRegion.value = null
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
    <div class="container geo-shell">
      <p class="section-kicker dark geo-kicker">{{ props.label }}</p>
      <h2 class="section-title geo-title">{{ props.title }}</h2>
      <p class="geo-lead">{{ props.description }}</p>

      <div class="geo-facts" aria-label="Ключевые факты по географии проекта">
        <div v-for="fact in geoFacts" :key="fact.label" class="geo-fact">
          <span class="geo-fact-value">{{ fact.value }}</span>
          <span class="geo-fact-label">{{ fact.label }}</span>
        </div>
      </div>

      <div class="geo-layout">
        <div class="geo-map-card g-frame-sm">
          <RussiaMap
            class-name="geo-map"
            :selected-region="selectedRegion"
            :active-regions="activeRegions"
            @region-click="handleRegionClick"
            @region-hover="handleRegionHover"
          />
        </div>

        <aside class="geo-side-card">
          <p class="geo-side-title">Города на карте</p>

          <ul class="geo-city-list">
            <li v-for="city in cities" :key="city.id">
              <button
                type="button"
                class="geo-city-item"
                :class="{ 'is-active': city.regionCode === selectedRegion }"
                @click="selectCity(city)"
                @mouseenter="highlightCity(city)"
                @mouseleave="clearCityHighlight"
              >
                <span class="geo-city-name">{{ city.name }}</span>
                <span class="geo-city-region">{{ city.regionName }}</span>
              </button>
            </li>
          </ul>

          <div class="geo-current" v-if="currentRegion">
            <p class="geo-current-label">Сейчас выбран регион</p>
            <p class="geo-current-name">{{ currentRegion.name }}</p>
          </div>

          <a class="btn btn-primary btn-small geo-cta" :href="props.ctaUrl">{{ props.ctaText }}</a>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.geo {
  position: relative;
  overflow: hidden;
  --surface-border: 1px solid rgba(16, 26, 51, 0.14);
  --surface-radius: var(--radius-lg);
  --surface-shadow: var(--shadow-soft);
  background-color: #ece8de;
}

.geo::before,
.geo::after {
  content: '';
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
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
  color: rgba(16, 25, 51, 0.68);
}

.geo-title {
  max-width: 880px;
  color: #101a35;
  text-wrap: balance;
}

.geo-lead {
  margin: 14px 0 24px;
  max-width: 720px;
  color: #44516d;
  line-height: 1.58;
  text-wrap: pretty;
}

.geo-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.geo-fact {
  min-height: 68px;
  display: grid;
  align-content: center;
  gap: 2px;
  border-radius: 14px;
  border: 1px solid rgba(16, 26, 51, 0.13);
  background:
    linear-gradient(170deg, rgba(255, 255, 255, 0.88) 0%, rgba(244, 247, 255, 0.86) 100%),
    radial-gradient(circle at 12% 18%, rgba(191, 211, 90, 0.16), rgba(191, 211, 90, 0) 38%);
  padding: 10px 12px;
  box-shadow: 0 10px 22px rgba(16, 26, 51, 0.09);
}

.geo-fact-value {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: clamp(1.08rem, 2vw, 1.42rem);
  line-height: 1;
  color: #102149;
}

.geo-fact-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.65rem;
  color: #556283;
  font-weight: 700;
}

.geo-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 18px;
  align-items: start;
}

.geo-map-card {
  position: relative;
  border-radius: var(--surface-radius);
  border: var(--surface-border);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.9) 0%, rgba(244, 248, 255, 0.9) 100%);
  box-shadow: var(--surface-shadow);
  padding: clamp(14px, 2vw, 24px);
  will-change: transform;
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.32s ease;
}

.geo-map {
  width: 100%;
}

.geo-map-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 22px 38px rgba(16, 26, 51, 0.16);
}

.geo-side-card {
  border-radius: var(--surface-radius);
  border: var(--surface-border);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.93) 0%, rgba(248, 250, 255, 0.92) 100%),
    radial-gradient(circle at 84% 12%, rgba(17, 70, 216, 0.06), rgba(17, 70, 216, 0) 38%);
  box-shadow: var(--surface-shadow);
  padding: 18px;
  will-change: transform;
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.32s ease;
}

.geo-side-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 38px rgba(16, 26, 51, 0.16);
}

.geo-side-title {
  margin: 0;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  font-size: 1.02rem;
  color: #15244a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.geo-city-list {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.geo-city-item {
  width: 100%;
  min-height: 44px;
  text-align: left;
  position: relative;
  padding: 10px 26px 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(16, 26, 51, 0.14);
  background: rgba(255, 255, 255, 0.82);
  display: grid;
  gap: 3px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.geo-city-item::after {
  content: '→';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%) translateX(-2px);
  opacity: 0;
  color: rgba(17, 70, 216, 0.74);
  font-weight: 700;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.geo-city-item:hover {
  transform: translateY(-1px);
  border-color: rgba(17, 70, 216, 0.4);
  background: rgba(255, 255, 255, 0.95);
}

.geo-city-item:hover::after,
.geo-city-item.is-active::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.geo-city-item:focus-visible {
  outline: 2px solid rgba(17, 70, 216, 0.72);
  outline-offset: 2px;
  border-color: rgba(17, 70, 216, 0.58);
  background: rgba(255, 255, 255, 0.96);
}

.geo-city-item.is-active {
  border-color: rgba(17, 70, 216, 0.56);
  background: rgba(17, 70, 216, 0.08);
}

.geo-city-name {
  font-weight: 700;
  color: #122349;
}

.geo-city-region {
  font-size: 0.8rem;
  color: #5a6782;
}

.geo-current {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(17, 70, 216, 0.08);
  border: 1px solid rgba(17, 70, 216, 0.2);
}

.geo-current-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
  color: #5b6885;
}

.geo-current-name {
  margin: 4px 0 0;
  color: #112248;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.geo-current-name::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #bfd35a;
  box-shadow: 0 0 0 0 rgba(191, 211, 90, 0.45);
  animation: geo-pulse 1.8s ease-out infinite;
}

.geo-cta {
  margin-top: 14px;
  width: 100%;
}

.geo-cta:focus-visible {
  outline: 2px solid rgba(17, 70, 216, 0.72);
  outline-offset: 3px;
}

.geo-map-card,
.geo-side-card,
.geo-fact {
  opacity: 0;
  transform: translateY(16px);
}

.geo.is-live .geo-map-card,
.geo.is-live .geo-side-card,
.geo.is-live .geo-fact {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.48s ease,
    transform 0.58s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.geo.is-live .geo-side-card {
  transition-delay: 0.08s;
}

.geo.is-live .geo-fact:nth-child(1) {
  transition-delay: 0.04s;
}

.geo.is-live .geo-fact:nth-child(2) {
  transition-delay: 0.1s;
}

.geo.is-live .geo-fact:nth-child(3) {
  transition-delay: 0.16s;
}

@media (max-width: 980px) {
  .geo::before {
    top: 22%;
    right: -22%;
  }

  .geo::after {
    left: -24%;
  }

  .geo-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .geo-layout {
    grid-template-columns: 1fr;
  }

  .geo-side-card {
    max-width: 620px;
  }
}

@media (max-width: 640px) {
  .geo-facts {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .geo-map-card,
  .geo-side-card,
  .geo-fact,
  .geo-city-item {
    transition: none;
  }

  .geo-city-item:hover,
  .geo-map-card:hover,
  .geo-side-card:hover {
    transform: none;
  }

  .geo-current-name::before {
    animation: none;
    box-shadow: none;
  }
}

@keyframes geo-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(191, 211, 90, 0.45);
  }

  70% {
    box-shadow: 0 0 0 8px rgba(191, 211, 90, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(191, 211, 90, 0);
  }
}
</style>
