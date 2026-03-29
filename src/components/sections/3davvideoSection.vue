<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import serviceVideoPoster from '../../assets/service-video-poster.jpg'

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
  quotes: {
    type: Array,
    default: () => [
      '«Служите Господу с радостью» (Псалом 99:2)',
      '«Всё, что делаете, делайте как для Господа» (Колоссянам 3:23)',
      'Здесь вера становится делом - вместе, честно и с любовью.'
    ]
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

      <div class="quote-grid">
        <p v-for="quote in props.quotes" :key="quote" class="quote-card">
          {{ quote }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.life {
  position: relative;
  background:
    radial-gradient(circle at 14% 16%, rgba(191, 211, 90, 0.11), rgba(191, 211, 90, 0) 34%),
    radial-gradient(circle at 86% 18%, rgba(255, 98, 51, 0.1), rgba(255, 98, 51, 0) 34%),
    linear-gradient(160deg, #07112c 0%, #0a1a44 48%, #06163f 100%);
  overflow: hidden;
}

.life-shell {
  position: relative;
  z-index: 1;
}

.life::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
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
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 26px 54px rgba(3, 6, 18, 0.42);
  background: #030715;
  isolation: isolate;
}

.portal-media {
  width: 100%;
  height: clamp(300px, 52vw, 620px);
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

.quote-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.quote-card {
  margin: 0;
  padding: 14px 16px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

@media (max-width: 1040px) {
  .quote-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .life-lead {
    margin-bottom: 20px;
  }

  .portal-stage {
    --corner-size: 72px;
    --corner-thickness: 12px;
    --corner-offset: 14px;
  }

  .portal-media {
    height: clamp(230px, 58vw, 420px);
  }

  .quote-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .life::after {
    height: 136px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .portal-media,
  .portal-corner,
  .portal-shutter {
    transition: none;
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
