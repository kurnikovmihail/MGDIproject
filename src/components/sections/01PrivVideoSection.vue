<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import heroPoster from '../../assets/section-01/01-hero-cover.jpg'
import heroVideo from '../../assets/section-01/02-hero-background.mp4'

const heroVideoRef = ref(null)
let canPlayHandler = null
let loadedDataHandler = null
let canPlayThroughHandler = null
let firstInteractionHandler = null
let visibilityChangeHandler = null
let autoplayRetryTimer = null
let autoplayRetryCount = 0

function clearAutoplayRetryTimer() {
  if (!autoplayRetryTimer) {
    return
  }

  window.clearInterval(autoplayRetryTimer)
  autoplayRetryTimer = null
}

function startAutoplayRetry() {
  const videoElement = heroVideoRef.value
  if (!videoElement) {
    return
  }

  autoplayRetryCount = 0
  clearAutoplayRetryTimer()

  autoplayRetryTimer = window.setInterval(() => {
    autoplayRetryCount += 1
    tryAutoplay()

    if (!videoElement.paused || autoplayRetryCount >= 18) {
      clearAutoplayRetryTimer()
    }
  }, 350)
}

function tryAutoplay() {
  const videoElement = heroVideoRef.value
  if (!videoElement) {
    return
  }

  videoElement.muted = true
  videoElement.defaultMuted = true
  videoElement.autoplay = true
  videoElement.loop = true
  videoElement.playsInline = true
  videoElement.setAttribute('muted', '')
  videoElement.setAttribute('playsinline', '')
  videoElement.setAttribute('webkit-playsinline', '')

  const playResult = videoElement.play()
  if (playResult && typeof playResult.catch === 'function') {
    playResult.catch(() => {})
  }
}

onMounted(() => {
  const videoElement = heroVideoRef.value
  if (!videoElement) {
    return
  }

  if (videoElement.readyState === 0) {
    videoElement.load()
  }

  canPlayHandler = () => {
    tryAutoplay()
  }

  loadedDataHandler = () => {
    tryAutoplay()
  }

  canPlayThroughHandler = () => {
    tryAutoplay()
  }

  firstInteractionHandler = () => {
    tryAutoplay()
    if (firstInteractionHandler) {
      window.removeEventListener('touchstart', firstInteractionHandler)
      window.removeEventListener('pointerdown', firstInteractionHandler)
    }
  }

  visibilityChangeHandler = () => {
    if (!document.hidden) {
      tryAutoplay()
    }
  }

  tryAutoplay()
  startAutoplayRetry()
  videoElement.addEventListener('canplay', canPlayHandler, { passive: true })
  videoElement.addEventListener('loadeddata', loadedDataHandler, { passive: true })
  videoElement.addEventListener('canplaythrough', canPlayThroughHandler, { passive: true })
  window.addEventListener('touchstart', firstInteractionHandler, { passive: true })
  window.addEventListener('pointerdown', firstInteractionHandler, { passive: true })
  document.addEventListener('visibilitychange', visibilityChangeHandler, { passive: true })
})

onBeforeUnmount(() => {
  clearAutoplayRetryTimer()

  const videoElement = heroVideoRef.value
  if (videoElement && canPlayHandler) {
    videoElement.removeEventListener('canplay', canPlayHandler)
  }
  if (videoElement && loadedDataHandler) {
    videoElement.removeEventListener('loadeddata', loadedDataHandler)
  }
  if (videoElement && canPlayThroughHandler) {
    videoElement.removeEventListener('canplaythrough', canPlayThroughHandler)
  }

  if (firstInteractionHandler) {
    window.removeEventListener('touchstart', firstInteractionHandler)
    window.removeEventListener('pointerdown', firstInteractionHandler)
  }

  if (visibilityChangeHandler) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler)
  }
})
</script>

<template>
  <section id="priv-video" class="hero" data-block-name="Priv.video">
    <div class="hero-backdrop" :style="{ backgroundImage: `url(${heroPoster})` }" aria-hidden="true"></div>
        <video
      ref="heroVideoRef"
      class="hero-media"
      :poster="heroPoster"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline="true"
      preload="auto"
      aria-hidden="true"
    >
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
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: calc(116px + env(safe-area-inset-top, 0px)) 0 70px;
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
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-origin: center;
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
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
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
  width: min(820px, 100%);
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
  max-width: 58ch;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.06rem;
  line-height: 1.66;
  text-wrap: pretty;
}

@media (max-width: 900px) {
  .hero {
    padding: calc(102px + env(safe-area-inset-top, 0px)) 0 58px;
  }

  .hero-content {
    gap: 14px;
  }

  .hero-lead {
    font-size: 1rem;
    max-width: 46ch;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: calc(96px + env(safe-area-inset-top, 0px)) 0 48px;
  }

  .hero-content {
    gap: 12px;
  }

  .hero-logo::after {
    margin-top: 8px;
    width: min(82vw, 280px);
  }

  .hero-lead {
    font-size: 0.95rem;
    line-height: 1.58;
  }
}

/* iPhone Safari stabilization: prevent scroll-time resampling/zoom artifacts */
@supports (-webkit-touch-callout: none) {
  @media (max-width: 900px) {
    .hero {
      height: 100svh;
      min-height: 100svh;
    }

    .hero-backdrop {
      filter: grayscale(100%) blur(12px) contrast(1.02) brightness(0.82);
      transform: none;
      -webkit-transform: none;
    }

    .hero-media {
      filter: grayscale(100%) contrast(1.02);
      transform: none;
      -webkit-transform: none;
    }
  }
}

@media (max-width: 420px) {
  .hero {
    padding-top: calc(90px + env(safe-area-inset-top, 0px));
  }

  .hero-logo {
    letter-spacing: 0.05em;
  }

  .hero-lead {
    font-size: 0.9rem;
  }
}
</style>

