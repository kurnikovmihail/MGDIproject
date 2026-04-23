<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import RussiaMap from '../ui/russia-map/RussiaMap.vue'
import cityBackdropPerm from '../../assets/section-04/02-city-perm.jpg'
import cityBackdropCherepovets from '../../assets/section-04/03-city-cherepovets.jpg'
import cityBackdropOmsk from '../../assets/section-04/04-city-omsk.jpg'
import cityBackdropKrasnoyarsk from '../../assets/section-04/05-city-krasnoyarsk.jpg'

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
const cityNameByRegion = Object.freeze({
  PER: 'Пермь',
  VLG: 'Череповец',
  OMS: 'Омск',
  KYA: 'Красноярск'
})
const coordinatorByRegion = Object.freeze({
  PER: {
    regionLabel: 'Пермский край',
    fullName: 'Нона Цинцадзе',
    phone: '+7 (965) 578-65-17',
    vk: 'https://vk.ru/mgdiperm'
  },
  VLG: {
    regionLabel: 'Вологодская область',
    fullName: 'Контакт уточняется',
    phone: '—',
    vk: ''
  },
  OMS: {
    regionLabel: 'Омская область',
    fullName: 'Валентин Гольштейн',
    phone: '+7 (996) 397-70-59',
    vk: 'https://vk.ru/club191156935'
  },
  KYA: {
    regionLabel: 'Красноярский край',
    fullName: 'Павел Долгополов',
    phone: '+7 (913) 565-62-01',
    vk: 'https://vk.ru/mgdi.krsk24'
  }
})

const activeRegions = Object.freeze(['PER', 'VLG', 'OMS', 'KYA'])
const selectedRegion = ref('PER')
const sectionRef = ref(null)
const isLive = ref(false)
let observer = null
const selectedCityPhoto = computed(() => {
  const regionCode = selectedRegion.value || 'PER'
  return cityBackdropByRegion[regionCode] ?? cityBackdropPerm
})
const selectedCityName = computed(() => {
  const regionCode = selectedRegion.value || 'PER'
  return cityNameByRegion[regionCode] ?? cityNameByRegion.PER
})
const selectedCoordinator = computed(() => {
  const regionCode = selectedRegion.value || 'PER'
  return coordinatorByRegion[regionCode] ?? coordinatorByRegion.PER
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
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
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
    <div
      class="geo-city-backdrop"
      :class="{ 'is-omsk': selectedRegion === 'OMS' }"
      :style="{ '--geo-city-image': `url(${selectedCityPhoto})` }"
      aria-hidden="true"
    >
      <div class="geo-city-backdrop-image"></div>
      <p class="geo-city-backdrop-caption">{{ selectedCityName }}</p>
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
            :selected-contact="selectedCoordinator"
            @region-click="handleRegionClick"
          />

          <div class="geo-map-legend" aria-label="Обозначения карты">
            <span class="geo-map-legend-item">
              <span class="geo-map-legend-dot is-active" aria-hidden="true"></span>
              Регионы проекта
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

.geo-city-backdrop-image {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: var(--geo-city-image);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 1;
  filter: saturate(1.22) contrast(1.04) brightness(1.01);
}

.geo-city-backdrop.is-omsk .geo-city-backdrop-image {
  filter: saturate(1.08) contrast(1.02) brightness(0.92);
}

.geo-city-backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  background: rgba(13, 30, 74, 0.4);
}

.geo-city-backdrop-caption {
  position: absolute;
  left: 50%;
  bottom: clamp(10px, 1.8vw, 24px);
  transform: translateX(-50%);
  z-index: 3;
  margin: 0;
  color: var(--text-main);
  font-family: 'Dela Gothic One', sans-serif;
  font-size: clamp(1.17rem, 1.56vw, 1.4rem);
  line-height: 1.1;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-align: center;
  white-space: nowrap;
  padding: clamp(6px, 0.9vw, 10px) clamp(14px, 2.2vw, 20px);
  border-radius: 999px;
  border: 1px solid rgba(16, 26, 51, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 6px 14px rgba(16, 26, 51, 0.08);
  pointer-events: none;
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
  color: var(--text-main);
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
  --map-max-inline-size: 980px;
  --map-margin-inline: auto;
  --map-clip-path: none;
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
  border: 1px solid rgba(150, 161, 182, 0.72);
  background: #cbd5e1;
  box-shadow: none;
}

.geo-map-legend-dot.is-active {
  background: #9ca3af;
  border-color: rgba(150, 161, 182, 0.72);
}

.geo-map-legend-dot.is-selected {
  background: var(--text-main);
  border-color: var(--text-main);
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
  .geo-title {
    margin-bottom: 14px;
  }

  .geo-map {
    width: 100%;
    margin-left: 0;
    --map-max-inline-size: 100%;
    --map-margin-inline: auto;
    --map-clip-path: none;
  }

  .geo-map-legend {
    margin-top: 8px;
    gap: 8px;
  }

  .geo-map-legend-item {
    font-size: 0.74rem;
    padding: 6px 10px;
  }

  .geo::before {
    top: 22%;
    right: -22%;
  }

  .geo::after {
    left: -24%;
  }

}

@media (max-width: 640px) {
  .geo-kicker {
    letter-spacing: 0.26em;
  }

  .geo-city-backdrop-caption {
    bottom: 8px;
    font-size: 1.02rem;
    padding: 6px 12px;
  }

  .geo-shell::after {
    display: none;
  }

  .geo-map {
    width: 100%;
    margin-left: 0;
    --map-clip-path: none;
  }

  .geo-map-legend-item {
    min-height: 34px;
    font-size: 0.7rem;
  }

  .geo::before,
  .geo::after {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .geo.is-live .geo-map-card {
    transition-duration: 0.28s, 0.34s;
  }

  .geo-map-card:hover {
    transform: none;
  }

  .geo-city-backdrop-image {
    transform: none;
  }

}
</style>
