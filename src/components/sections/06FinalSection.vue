<script setup>
import mgdiPatternImage from '../../assets/mgdi-pattern-strip.png'

const rowDurations = [55, 68, 60, 75]
const patternRows = Array.from({ length: 7 }, (_, index) => ({
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
        <a class="btn btn-primary" href="#">Подать заявку</a>
        <a class="btn btn-secondary" href="#">Стать партнером</a>
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
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 100%);
  background-size: 120px 120px;
  opacity: 0.25;
}

.final-pattern {
  --final-shift: 1540px;
  --final-steps: 1540;
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
  animation-timing-function: steps(var(--final-steps), end);
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
  opacity: 0.22;
  filter: saturate(0.92) brightness(0.9);
  image-rendering: auto;
  user-select: none;
}

.final-shell {
  position: relative;
  z-index: 3;
}

.final-title {
  margin: 0;
  max-width: 960px;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 0.94;
  text-transform: uppercase;
  font-size: clamp(2.1rem, 6vw, 5.1rem);
}

.final-text {
  margin: 18px 0 30px;
  max-width: 680px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.02rem;
  line-height: 1.56;
}

.final-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
  .final-row:nth-child(n + 7) {
    display: none;
  }
}

@media (max-width: 900px) {
  .final-pattern {
    --final-shift: 770px;
    --final-steps: 770;
    padding: 10px 0;
    gap: 6px;
  }

  .final-row:nth-child(n + 5) {
    display: none;
  }

  .final-strip {
    height: 45px;
  }

  .final-text {
    margin-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .final-track {
    animation: none;
  }
}
</style>

