<script setup>
import mgdiPatternImage from '../../assets/mgdi-pattern-strip.png'

const rowDurations = [64, 78, 70, 86]
const patternRows = Array.from({ length: 6 }, (_, index) => ({
  id: `final-row-${index + 1}`,
  reverse: index % 2 === 1,
  duration: rowDurations[index % rowDurations.length] + Math.floor(index / 4) * 4
}))
</script>

<template>
  <section id="final" class="final section-block">
    <div class="final-pattern" aria-hidden="true">
      <div
        v-for="row in patternRows"
        :key="row.id"
        class="final-row"
        :class="{ 'is-reverse': row.reverse }"
        :style="{ '--final-duration': `${row.duration}s` }"
      >
        <div class="final-track">
          <img class="final-strip" :src="mgdiPatternImage" alt="" />
          <img class="final-strip" :src="mgdiPatternImage" alt="" />
        </div>
      </div>
    </div>

    <div class="container final-shell">
      <p class="section-kicker">Финал</p>
      <h2 class="final-title">
        Присоединяйся к движению.
        <span class="accent-lime">Служим Богу</span>
        вместе.
      </h2>
      <p class="final-text">
        Мы открыты для участников, наставников и партнеров. Если хотите запускать идеи,
        которые несут пользу людям и городу, вы в правильном месте.
      </p>
      <div class="final-actions">
        <a class="btn btn-primary final-btn" href="#3davvideo">Подать заявку</a>
        <a class="btn btn-secondary final-btn" href="#moments">Стать партнером</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  color: var(--white);
  background:
    radial-gradient(circle at 78% 18%, rgba(191, 211, 90, 0.22), rgba(191, 211, 90, 0) 34%),
    radial-gradient(circle at 16% 78%, rgba(255, 98, 51, 0.2), rgba(255, 98, 51, 0) 34%),
    linear-gradient(148deg, #0a2b8f 0%, #1146d8 36%, #0a2a8a 100%);
}

.final::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(7, 22, 66, 0.36) 0%, rgba(7, 22, 66, 0.42) 50%, rgba(7, 22, 66, 0.5) 100%),
    radial-gradient(circle at 52% 26%, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0) 58%);
  opacity: 1;
}

.final::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: 146px;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(8, 26, 83, 0) 0%,
    rgba(8, 26, 83, 0.24) 42%,
    rgba(8, 26, 83, 0.54) 100%
  );
}

.final-pattern {
  --final-shift: 1540px;
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  pointer-events: none;
  overflow: hidden;
}

.final-row {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.final-track {
  width: max-content;
  display: flex;
  align-items: center;
  gap: 0;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  animation-name: final-slide-left;
  animation-duration: var(--final-duration, 60s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.final-row.is-reverse .final-track {
  animation-name: final-slide-right;
}

.final-strip {
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

.final-shell {
  position: relative;
  z-index: 3;
  max-width: 1020px;
}

.final-title {
  margin: 0;
  max-width: 960px;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 0.96;
  text-transform: uppercase;
  font-size: clamp(2.1rem, 6vw, 5.1rem);
  text-wrap: balance;
}

.final-text {
  margin: 18px 0 30px;
  max-width: 62ch;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.03rem;
  line-height: 1.68;
  text-shadow: 0 2px 10px rgba(4, 8, 20, 0.32);
  text-wrap: pretty;
}

.final-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.final-btn {
  min-width: 210px;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

@keyframes final-slide-left {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(calc(-1 * var(--final-shift)), 0, 0);
  }
}

@keyframes final-slide-right {
  from {
    transform: translate3d(calc(-1 * var(--final-shift)), 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

@media (max-width: 1200px) {
  .final-row:nth-child(n + 5) {
    display: none;
  }
}

@media (max-width: 900px) {
  .final-pattern {
    --final-shift: 770px;
    padding: 10px 0;
    gap: 6px;
  }

  .final-row:nth-child(n + 4) {
    display: none;
  }

  .final-strip {
    height: 45px;
  }

  .final-text {
    margin-bottom: 24px;
  }

  .final-actions {
    gap: 10px;
  }

  .final-btn {
    min-width: 188px;
  }
}

@media (max-width: 640px) {
  .final-title {
    line-height: 1;
  }

  .final-text {
    font-size: 0.98rem;
    line-height: 1.58;
  }

  .final-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .final-btn {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .final-track {
    animation: none;
  }
}
</style>
