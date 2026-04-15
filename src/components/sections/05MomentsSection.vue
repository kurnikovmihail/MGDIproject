<script setup>
import featuredPoster from '../../assets/service-video-poster.jpg'

defineProps({
  cards: {
    type: Array,
    required: true
  },
  parallaxShift: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <section id="moments" class="moments section-block">
    <div class="container">
      <p class="section-kicker dark">Моменты</p>
      <h2 class="section-title moments-title">Сцены, где ощущается движение служения</h2>

      <div class="featured-media" :style="{ transform: `translateY(${-parallaxShift * 0.55}px)` }">
        <img :src="featuredPoster" alt="Кадр приветственного видео проекта" class="featured-poster" loading="lazy" />
        <div class="featured-overlay" aria-hidden="true"></div>
        <div class="featured-caption">
          <span class="orbit-chip">Видео</span>
          <strong>Приветственное слово и атмосфера команды</strong>
        </div>
      </div>

      <div class="slider-row">
        <article
          v-for="item in cards"
          :key="item.title"
          class="slider-card"
          :style="{ '--thumb-image': `url(${item.image})` }"
        >
          <div class="slider-thumb"></div>
          <p>{{ item.title }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.moments {
  background: linear-gradient(180deg, #ece8de 0%, #f3f0e8 100%);
}

.moments-title {
  max-width: 960px;
}

.featured-media {
  margin-top: 32px;
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  min-height: 420px;
  box-shadow: var(--shadow-pop);
  transition: transform 0.25s ease;
}

.featured-poster {
  min-height: 420px;
  object-fit: cover;
  object-position: center;
  transform: scale(1.03);
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 10, 24, 0.16), rgba(5, 10, 24, 0.62)),
    radial-gradient(circle at 72% 22%, rgba(255, 98, 51, 0.2), rgba(255, 98, 51, 0));
}

.featured-caption {
  position: absolute;
  left: 20px;
  bottom: 20px;
  right: 20px;
  display: grid;
  gap: 10px;
  color: var(--white);
}

.featured-caption strong {
  font-size: clamp(1rem, 2.2vw, 1.45rem);
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
}

.slider-row {
  margin-top: 26px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(230px, 1fr);
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;
}

.slider-row::-webkit-scrollbar {
  height: 8px;
}

.slider-row::-webkit-scrollbar-thumb {
  background: rgba(17, 70, 216, 0.32);
  border-radius: 999px;
}

.slider-card {
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--white);
  box-shadow: var(--shadow-soft);
  border: var(--border-soft);
  scroll-snap-align: start;
  transition: transform 0.25s ease;
}

.slider-card:hover {
  transform: translateY(-4px);
}

.slider-thumb {
  height: 154px;
  background-image: linear-gradient(180deg, rgba(6, 11, 24, 0.08), rgba(6, 11, 24, 0.34)), var(--thumb-image);
  background-size: cover;
  background-position: center;
}

.slider-card p {
  margin: 0;
  padding: 12px;
  font-weight: 700;
  color: #1a223a;
}

@media (max-width: 900px) {
  .featured-media,
  .featured-poster {
    min-height: 280px;
  }

  .slider-row {
    grid-auto-columns: minmax(190px, 1fr);
  }
}
</style>
