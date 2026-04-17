<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import guitarCard from '../../assets/card-guitar.png'
import communicationCard from '../../assets/card-communication.png'
import learningCard from '../../assets/card-learning.png'
import tripsCard from '../../assets/card-trips.png'
import mgdiPatternImage from '../../assets/mgdi-pattern-strip.png'

const iconSet = [guitarCard, communicationCard, learningCard, tripsCard]
const rowDurations = [62, 76, 68, 84]
const patternRows = Array.from({ length: 10 }, (_, index) => ({
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
  cards: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const isCardsOpen = ref(false)
let observer = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isCardsOpen.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry || !entry.isIntersecting) {
        return
      }

      isCardsOpen.value = true
      observer.disconnect()
      observer = null
    },
    {
      threshold: 0.3
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
    :class="{ 'is-cards-open': isCardsOpen }"
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

      <div v-if="props.cards.length" class="grid-12 why-grid life-cards">
        <article
          v-for="(card, index) in props.cards"
          :key="card.title"
          class="why-card col-3"
          :style="{ '--card-delay': `${index * 90}ms` }"
        >
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

.life::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(6, 22, 63, 0.5) 0%, rgba(6, 22, 63, 0.42) 48%, rgba(6, 22, 63, 0.58) 100%),
    radial-gradient(circle at 50% 34%, rgba(6, 22, 63, 0.08), rgba(6, 22, 63, 0.42) 78%);
}

.life-shell {
  position: relative;
  z-index: 3;
}

.mgdi-pattern {
  --mgdi-shift: 1540px;
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
  animation-name: mgdi-slide-left;
  animation-duration: var(--mgdi-duration, 60s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.mgdi-row.is-reverse .mgdi-track {
  animation-name: mgdi-slide-right;
}

.mgdi-strip {
  flex: 0 0 auto;
  display: block;
  width: auto;
  min-width: 0;
  height: 90px;
  margin-right: 0;
  opacity: 0.14;
  filter: saturate(0.84) brightness(0.78);
  image-rendering: auto;
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
  margin: 16px 0 26px;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.03rem;
  line-height: 1.62;
  text-shadow: 0 2px 10px rgba(4, 8, 20, 0.32);
}

.life-cards {
  margin-top: 8px;
  align-items: start;
}

.why-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 16px 10px 12px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(5, 14, 38, 0.26);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 18px 34px rgba(4, 8, 22, 0.24);
  isolation: isolate;
  opacity: 0;
  transform: translateY(14px) scale(0.965);
  transition:
    transform 0.82s cubic-bezier(0.2, 0.75, 0.18, 1),
    opacity 0.72s ease,
    box-shadow 0.36s ease;
  transition-delay: var(--card-delay, 0ms);
}

.why-card::before,
.why-card::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 52%;
  z-index: 2;
  pointer-events: none;
  transition:
    transform 1.02s cubic-bezier(0.2, 0.72, 0.22, 1),
    opacity 1.02s ease;
  transition-delay: var(--card-delay, 0ms);
}

.why-card::before {
  left: 0;
  background: linear-gradient(90deg, rgba(4, 8, 21, 0.98) 0%, rgba(4, 8, 21, 0.8) 100%);
}

.why-card::after {
  right: 0;
  background: linear-gradient(270deg, rgba(4, 8, 21, 0.98) 0%, rgba(4, 8, 21, 0.8) 100%);
}

.why-card > * {
  position: relative;
  z-index: 3;
  opacity: 0;
  transform: translateY(10px);
  transition:
    transform 0.66s cubic-bezier(0.2, 0.75, 0.18, 1),
    opacity 0.62s ease;
  transition-delay: calc(var(--card-delay, 0ms) + 130ms);
}

.why-top {
  margin: 0;
  min-height: 2.5em;
  font-size: 0.88rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.96);
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.58),
    0 2px 12px rgba(6, 11, 24, 0.5),
    0 0 10px rgba(199, 216, 97, 0.2);
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
  font-family: 'Montserrat', 'Segoe UI', sans-serif;
  font-size: clamp(0.98rem, 1.08vw, 1.12rem);
  font-weight: 800;
  letter-spacing: 0.012em;
  line-height: 1.42;
  text-shadow:
    0 1px 0 rgba(0, 0, 0, 0.58),
    0 3px 14px rgba(6, 11, 24, 0.54),
    0 0 10px rgba(199, 216, 97, 0.2);
}

.life.is-cards-open .why-card {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.life.is-cards-open .why-card::before {
  transform: translateX(-108%);
  opacity: 0;
}

.life.is-cards-open .why-card::after {
  transform: translateX(108%);
  opacity: 0;
}

.life.is-cards-open .why-card > * {
  opacity: 1;
  transform: translateY(0);
}

.why-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 24px 40px rgba(4, 8, 22, 0.3);
}

@keyframes mgdi-slide-left {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(-1 * var(--mgdi-shift)), 0, 0);
  }
}

@keyframes mgdi-slide-right {
  from {
    transform: translate3d(calc(-1 * var(--mgdi-shift)), 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@media (max-width: 1200px) {
  .mgdi-row:nth-child(n + 9) {
    display: none;
  }
}

@media (max-width: 900px) {
  .mgdi-pattern {
    --mgdi-shift: 770px;
    padding: 10px 0;
    gap: 6px;
  }

  .mgdi-row:nth-child(n + 5) {
    display: none;
  }

  .mgdi-strip {
    height: 45px;
  }

  .life-lead {
    margin-bottom: 20px;
  }

  .life::after {
    height: 136px;
  }

  .life-cards {
    margin-top: 6px;
  }

  .why-card {
    padding: 14px 8px 10px;
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
  .why-card,
  .why-card::before,
  .why-card::after,
  .why-card > * {
    transition: none;
  }

  .mgdi-track {
    animation: none;
  }

  .why-card,
  .why-card > * {
    opacity: 1;
    transform: none;
  }

  .why-card::before,
  .why-card::after {
    opacity: 0;
    transform: none;
  }
}
</style>
