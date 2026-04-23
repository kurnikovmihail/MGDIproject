<script setup>
import mgdiPatternImage from '../../assets/section-06/01-pattern-strip.png'

const rowDurations = [64, 78, 70, 86]
const patternRows = Array.from({ length: 12 }, (_, index) => ({
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
      <div class="final-actions">
        <a
          class="btn btn-primary final-btn"
          href="https://forms.yandex.ru/u/67a0d2d6d04688eb48b52c96/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Подать заявку
        </a>
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
  --final-speed: 1;
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(2px, 0.4vw, 6px);
  padding: clamp(5px, 0.8vw, 10px) 0;
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
  animation-duration: calc(var(--final-duration, 60s) * var(--final-speed));
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

.final-actions {
  margin-top: 26px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.final-btn {
  min-width: 210px;
  min-height: 46px;
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
  .final-row:nth-child(n + 11) {
    display: none;
  }
}

@media (max-width: 900px) {
  .final-pattern {
    --final-shift: 770px;
    --final-speed: 0.7;
    padding: 6px 0;
    gap: 4px;
  }

  .final-row:nth-child(n + 10) {
    display: none;
  }

  .final-strip {
    height: 34px;
    opacity: 0.26;
    filter: saturate(0.98) brightness(0.88);
  }

  .final-actions {
    margin-top: 20px;
    gap: 10px;
  }

  .final-btn {
    min-width: 188px;
    min-height: 44px;
  }
}

@media (max-width: 640px) {
  .final-row:nth-child(n + 9) {
    display: none;
  }

  .final-strip {
    height: 30px;
  }

  .final-shell {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .final-title {
    line-height: 1;
    max-width: 12ch;
  }

  .final-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .final-btn {
    width: 100%;
    min-width: 0;
    font-size: 0.88rem;
  }
}

@media (max-width: 420px) {
  .final-row:nth-child(n + 8) {
    display: none;
  }

  .final-strip {
    height: 27px;
  }
}

@media (hover: none) {
  .final-btn:hover {
    background: var(--accent-lime);
    color: #11131b;
    transform: none;
    box-shadow: 0 14px 30px rgba(191, 211, 90, 0.34);
  }
}

@media (prefers-reduced-motion: reduce) {
  .final-track {
    animation-duration: calc(var(--final-duration, 60s) * 1.2);
  }
}
</style>
