<script setup>
import heroPoster from '../../assets/hero-cover.jpg'
import heroVideo from '../../assets/hero_bw_desktop_1920x1080.mp4'
</script>

<template>
  <section id="priv-video" class="hero" data-block-name="Priv.video">
    <div class="hero-backdrop" :style="{ backgroundImage: `url(${heroPoster})` }" aria-hidden="true"></div>
    <video class="hero-media" :poster="heroPoster" autoplay muted loop playsinline preload="auto" aria-hidden="true">
      <source :src="heroVideo" type="video/mp4" />
    </video>
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="hero-noise" aria-hidden="true"></div>

    <div class="container hero-content">
      <p class="section-kicker">Молодежный проект</p>
      <p class="hero-logo" aria-label="МГДИ">МГДИ</p>
      <p class="hero-lead">
        Яркая команда, живая вера и реальные дела для Бога.
      </p>

      <div class="hero-actions">
        <a class="hero-btn" href="#historyproect2">Узнать больше</a>
        <a class="hero-btn" href="#4geogrf">Смотреть города</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 124px 0 70px;
  overflow: hidden;
  background: #050810;
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
  filter: grayscale(100%) blur(26px) contrast(1.08) brightness(0.78);
  transform: scale(1.18);
}

.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: grayscale(100%) contrast(1.04);
  z-index: 1;
  opacity: 0.96;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    radial-gradient(ellipse at center, rgba(4, 8, 22, 0) 44%, rgba(4, 8, 22, 0.52) 76%, rgba(4, 8, 22, 0.88) 100%),
    linear-gradient(180deg, rgba(4, 8, 22, 0.24) 0%, rgba(4, 8, 22, 0.46) 52%, rgba(4, 8, 22, 0.76) 100%);
}

.hero-noise {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 15% 18%, rgba(191, 211, 90, 0.18), rgba(191, 211, 90, 0) 28%),
    radial-gradient(circle at 86% 78%, rgba(255, 98, 51, 0.18), rgba(255, 98, 51, 0) 34%);
}

.hero-content {
  position: relative;
  z-index: 5;
  display: grid;
  justify-items: center;
  gap: 18px;
  text-align: center;
}

.hero-logo {
  margin: 0;
  font-family: 'Dela Gothic One', sans-serif;
  font-size: clamp(3.4rem, 8.7vw, 8.6rem);
  line-height: 0.86;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.96);
  text-shadow:
    0 10px 26px rgba(0, 0, 0, 0.36),
    0 0 1px rgba(255, 255, 255, 0.3);
  user-select: none;
}

.hero-logo::after {
  content: '';
  display: block;
  margin: 10px auto 0;
  width: clamp(180px, 24vw, 320px);
  height: 1px;
  background: linear-gradient(90deg, rgba(191, 211, 90, 0), rgba(191, 211, 90, 0.78), rgba(255, 98, 51, 0));
}

.hero-lead {
  margin: 0;
  max-width: 660px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.04rem;
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.hero-btn {
  min-width: 196px;
  padding: 14px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.96);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.78rem;
  backdrop-filter: blur(5px);
  transition: background 0.24s ease, border-color 0.24s ease, transform 0.24s ease;
}

.hero-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .hero {
    padding: 112px 0 58px;
  }

  .hero-content {
    gap: 14px;
  }

  .hero-lead {
    font-size: 0.95rem;
  }

  .hero-btn {
    min-width: 170px;
    padding: 12px 16px;
    font-size: 0.72rem;
  }
}
</style>
