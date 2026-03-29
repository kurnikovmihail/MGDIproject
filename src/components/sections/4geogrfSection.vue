<script setup>
import { geographyMapData } from '../../data/geographyMapData'

const props = defineProps({
  config: {
    type: Object,
    default: () => geographyMapData
  }
})
</script>

<template>
  <section id="4geogrf" class="geo-reset section-block" data-block-name="4geogrf">
    <div class="container">
      <p class="section-kicker dark geo-reset-kicker">{{ props.config.label }}</p>
      <h2 class="section-title geo-reset-title">{{ props.config.title }}</h2>
      <p class="geo-reset-lead">{{ props.config.description }}</p>

      <div class="geo-reset-card">
        <p class="geo-reset-card-title">{{ props.config.statusTitle }}</p>
        <p class="geo-reset-card-text">{{ props.config.statusText }}</p>

        <a class="btn btn-primary btn-small geo-reset-cta" :href="props.config.ctaUrl">
          {{ props.config.ctaText }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.geo-reset {
  background:
    radial-gradient(circle at 88% 18%, rgba(255, 98, 51, 0.08), rgba(255, 98, 51, 0) 34%),
    radial-gradient(circle at 14% 84%, rgba(191, 211, 90, 0.14), rgba(191, 211, 90, 0) 30%),
    linear-gradient(180deg, #f3f0e8 0%, #ece8dd 100%);
}

.geo-reset-kicker {
  letter-spacing: 0.34em;
  color: rgba(16, 25, 51, 0.7);
}

.geo-reset-title {
  max-width: 920px;
  color: #101a35;
}

.geo-reset-lead {
  margin: 14px 0 24px;
  max-width: 720px;
  color: #44516d;
  line-height: 1.58;
}

.geo-reset-card {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(16, 26, 51, 0.14);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.9) 0%, rgba(244, 247, 255, 0.86) 100%),
    repeating-linear-gradient(
      32deg,
      rgba(17, 70, 216, 0.03) 0,
      rgba(17, 70, 216, 0.03) 8px,
      transparent 8px,
      transparent 16px
    );
  box-shadow: var(--shadow-soft);
  padding: clamp(22px, 3vw, 34px);
}

.geo-reset-card-title {
  margin: 0;
  font-family: 'Dela Gothic One', sans-serif;
  font-size: clamp(1.15rem, 2.4vw, 1.6rem);
  font-weight: 400;
  color: #142348;
  letter-spacing: 0.02em;
}

.geo-reset-card-text {
  margin: 12px 0 20px;
  max-width: 760px;
  color: #3e4b66;
  line-height: 1.58;
}

.geo-reset-cta {
  gap: 10px;
}
</style>
