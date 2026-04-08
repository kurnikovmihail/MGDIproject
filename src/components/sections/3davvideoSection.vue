<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import serviceVideoPoster from '../../assets/service-video-poster.jpg'
import guitarCard from '../../assets/card-guitar.png'
import communicationCard from '../../assets/card-communication.png'
import learningCard from '../../assets/card-learning.png'
import tripsCard from '../../assets/card-trips.png'
import mgdiPatternImage from '../../assets/mgdi-pattern-strip.png'

const iconSet = [guitarCard, communicationCard, learningCard, tripsCard]
const rowDurations = [55, 68, 60, 75]
const patternRows = Array.from({ length: 12 }, (_, index) => ({
  id: `row-${index + 1}`,
  reverse: index % 2 === 1,
  duration: rowDurations[index % rowDurations.length] + Math.floor(index / 4) * 4
}))

const props = defineProps({
  label: {
    type: String,
    default: 'Служение'
  },
  title: {
    type: String,
    default: 'Это больше, чем проект - это служение'
  },
  lead: {
    type: String,
    default:
      'Мы верим, что здесь служение Богу становится живым делом: через команду, заботу о людях и реальные шаги, которые меняют среду вокруг.'
  },
  posterSrc: {
    type: String,
    default: serviceVideoPoster
  },
  posterAlt: {
    type: String,
    default: 'Приветственное видео о служении в проекте МГДИ'
  },
  cards: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const isPortalOpen = ref(false)
let observer = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isPortalOpen.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry || !entry.isIntersecting) {
        return
      }

      isPortalOpen.value = true
      observer.disconnect()
      observer = null
    },
    {
      threshold: 0.32
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
    id="3davvideo"
    ref="sectionRef"
    class="life section-block"
    data-block-name="3davvideo"
    :class="{ 'is-portal-open': isPortalOpen }"
  >
    <div class="mgdi-pattern" aria-hidden="true">
      <div
        v-for="row in patternRows"
        :key="row.id"
        class="mgdi-row"
        :class="{ 'is-reverse': row.reverse }"
        :style="{ '--mgdi-duration': `${row.duration}s` }"
      >
        <div class="mgdi-track">
          <img class="mgdi-strip" :src="mgdiPatternImage" alt="" />
          <img class="mgdi-strip" :src="mgdiPatternImage" alt="" />
        </div>
      </div>
    </div>

    <div class="container life-shell">
      <p class="section-kicker">{{ props.label }}</p>
      <h2 class="section-title life-title">{{ props.title }}</h2>
      <p class="life-lead">{{ props.lead }}</p>

      <div class="portal-stage">
        <div class="portal-corner portal-corner-left" aria-hidden="true"></div>
        <div class="portal-corner portal-corner-right" aria-hidden="true"></div>

        <div class="portal-shutter portal-shutter-left" aria-hidden="true"></div>
        <div class="portal-shutter portal-shutter-right" aria-hidden="true"></div>

        <img :src="props.posterSrc" :alt="props.posterAlt" class="portal-media" loading="lazy" />
        <div class="portal-overlay" aria-hidden="true"></div>
        <p class="portal-tag">Приветственное видео</p>
      </div>

      <div v-if="props.cards.length" class="grid-12 why-grid life-cards">
        <article v-for="(card, index) in props.cards" :key="card.title" class="why-card col-3">
          <p class="why-top">{{ card.title }}</p>

          <div class="why-icon-shell" aria-hidden="true">
            <img class="why-icon" :src="iconSet[index % iconSet.length]" alt="" />
          </div>

          <p class="why-bottom">{{ card.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.life {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 14% 16%, rgba(191, 211, 90, 0.11), rgba(191, 211, 90, 0) 34%),
    radial-gradient(circle at 86% 18%, rgba(255, 98, 51, 0.1), rgba(255, 98, 51, 0) 34%),
    linear-gradient(160deg, #07112c 0%, #0a1a44 48%, #06163f 100%);
}

.life-shell {
  position: relative;
  z-index: 3;
}

.mgdi-pattern {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 0.6vw, 12px);
  padding: clamp(10px, 1.4vw, 20px) 0;
  pointer-events: none;
  overflow: hidden;
}

.mgdi-row {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.mgdi-track {
  width: max-content;
  display: flex;
  gap: 0;
  align-items: center;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  animation: mgdi-slide-left var(--mgdi-duration, 60s) linear infinite;
}

.mgdi-row.is-reverse .mgdi-track {
  animation-name: mgdi-slide-right;
}

.mgdi-strip {
  flex: 0 0 auto;
  display: block;
  width: auto;
  min-width: 0;
  height: 106px;
  margin-right: 0;
  opacity: 0.4;
  filter: saturate(0.98) brightness(0.96);
  user-select: none;
}

.life::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: 180px;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(6, 22, 63, 0.14) 0%,
    rgba(6, 22, 63, 0.84) 56%,
    #06163f 100%
  );
}

.life-title {
  max-width: 980px;
  color: var(--white);
}

.life-lead {
  margin: 16px 0 28px;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.03rem;
  line-height: 1.58;
}

.portal-stage {
  position: relative;
  --corner-size: 96px;
  --corner-thickness: 16px;
  --corner-offset: 18px;
  width: min(100%, 980px);
  margin-inline: auto;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 30px 60px rgba(3, 6, 18, 0.45);
  background: #030715;
  isolation: isolate;
}

.portal-media {
  width: 100%;
  height: clamp(240px, 42vw, 500px);
  object-fit: cover;
  opacity: 0.24;
  transform: scale(1.08);
  transition: opacity 1.05s ease, transform 1.05s ease;
}

.portal-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(180deg, rgba(3, 7, 18, 0.12) 0%, rgba(3, 7, 18, 0.32) 100%),
    radial-gradient(circle at 50% 50%, rgba(17, 70, 216, 0.14), rgba(17, 70, 216, 0));
  pointer-events: none;
}

.portal-corner {
  position: absolute;
  z-index: 6;
  width: var(--corner-size);
  height: var(--corner-size);
  top: calc(50% - (var(--corner-size) / 2));
  left: calc(50% - (var(--corner-size) / 2));
  opacity: 0;
  transform: scale(0.72) rotate(-5deg);
  transition:
    top 0.92s cubic-bezier(0.2, 0.75, 0.18, 1),
    left 0.92s cubic-bezier(0.2, 0.75, 0.18, 1),
    opacity 0.46s ease,
    transform 0.92s cubic-bezier(0.2, 0.75, 0.18, 1);
}

.portal-corner::before,
.portal-corner::after {
  content: '';
  position: absolute;
  background: color-mix(in srgb, var(--accent-lime) 92%, white 8%);
  box-shadow: 0 10px 24px rgba(191, 211, 90, 0.24);
}

.portal-corner-left::before {
  top: 0;
  left: 0;
  width: 72%;
  height: var(--corner-thickness);
  border-radius: 14px 4px 10px 4px;
}

.portal-corner-left::after {
  top: 0;
  left: 0;
  width: var(--corner-thickness);
  height: 72%;
  border-radius: 14px 4px 10px 4px;
}

.portal-corner-right::before {
  right: 0;
  bottom: 0;
  width: 72%;
  height: var(--corner-thickness);
  border-radius: 10px 4px 14px 4px;
}

.portal-corner-right::after {
  right: 0;
  bottom: 0;
  width: var(--corner-thickness);
  height: 72%;
  border-radius: 10px 4px 14px 4px;
}

.portal-shutter {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  z-index: 4;
  pointer-events: none;
  transition: transform 1.02s cubic-bezier(0.2, 0.72, 0.22, 1), opacity 1.02s ease;
}

.portal-shutter-left {
  left: 0;
  background: linear-gradient(90deg, rgba(4, 8, 21, 0.98) 0%, rgba(4, 8, 21, 0.8) 100%);
}

.portal-shutter-right {
  right: 0;
  background: linear-gradient(270deg, rgba(4, 8, 21, 0.98) 0%, rgba(4, 8, 21, 0.8) 100%);
}

.portal-tag {
  position: absolute;
  left: 20px;
  bottom: 16px;
  z-index: 6;
  margin: 0;
  padding: 8px 12px;
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.94);
  background: rgba(8, 16, 38, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.26);
  backdrop-filter: blur(6px);
}

.life-cards {
  margin-top: 34px;
  align-items: start;
}

.why-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 0 8px;
}

.why-top {
  margin: 0;
  min-height: 2.5em;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.96);
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.55),
    0 0 10px rgba(199, 216, 97, 0.18);
}

.why-icon-shell {
  width: min(100%, 195px);
  aspect-ratio: 1 / 1;
}

.why-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.why-bottom {
  margin: 0;
  min-height: 4.4em;
  max-width: 230px;
  color: #c7d861;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.5;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.48),
    0 0 8px rgba(199, 216, 97, 0.16);
}

.life.is-portal-open .portal-corner {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.life.is-portal-open .portal-corner-left {
  top: var(--corner-offset);
  left: var(--corner-offset);
}

.life.is-portal-open .portal-corner-right {
  top: calc(100% - var(--corner-offset) - var(--corner-size));
  left: calc(100% - var(--corner-offset) - var(--corner-size));
  transition-delay: 0.06s;
}

.life.is-portal-open .portal-shutter-left {
  transform: translateX(-104%);
  opacity: 0;
}

.life.is-portal-open .portal-shutter-right {
  transform: translateX(104%);
  opacity: 0;
}

.life.is-portal-open .portal-media {
  opacity: 1;
  transform: scale(1);
  transition-delay: 0.12s;
}

@keyframes mgdi-slide-left {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes mgdi-slide-right {
  from {
    transform: translateX(-50%);
  }

  to {
    transform: translateX(0);
  }
}

@media (max-width: 1200px) {
  .mgdi-row:nth-child(n + 11) {
    display: none;
  }

}

@media (max-width: 900px) {
  .mgdi-pattern {
    padding: 10px 0;
    gap: 6px;
  }

  .mgdi-row:nth-child(n + 6) {
    display: none;
  }

  .mgdi-strip {
    height: 53px;
  }

  .life-lead {
    margin-bottom: 20px;
  }

  .portal-stage {
    --corner-size: 72px;
    --corner-thickness: 12px;
    --corner-offset: 14px;
  }

  .portal-media {
    height: clamp(200px, 52vw, 360px);
  }

  .life::after {
    height: 136px;
  }

  .life-cards {
    margin-top: 24px;
  }

  .why-top {
    min-height: auto;
  }

  .why-icon-shell {
    width: min(100%, 176px);
  }

  .why-bottom {
    min-height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mgdi-track,
  .portal-media,
  .portal-corner,
  .portal-shutter {
    transition: none;
  }

  .mgdi-track {
    animation: none;
  }

  .portal-media {
    opacity: 1;
    transform: none;
  }

  .portal-corner {
    opacity: 1;
    transform: none;
  }

  .portal-shutter-left {
    opacity: 0;
    transform: translateX(-104%);
  }

  .portal-shutter-right {
    opacity: 0;
    transform: translateX(104%);
  }
}
</style>

