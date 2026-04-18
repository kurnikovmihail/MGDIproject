<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import teamPhoto from '../../assets/hero-cover.jpg'
import davidPhoto from '../../assets/давид.jpg'

const aboutParagraphs = [
  'Привет. Я Давид, и МГДИ появился из простой идеи: дать ребятам пространство, где они могут полностью посвятить себя и свое время для духовной роста и практики.',
  'Мы имеем привилегию видеть, как Бог поднимает и формирует молодых и помазанных служителей!',
  'МГДИ - это благословенное время роста в служении. Если ты давно хочешь бросить себе вызов, мечтаешь служить Богу на полное время, хочешь прокачать свои навыки и перенять опыт, чтоб потом служить этим в своей церкви, то этот год для тебя.',
  'Каждый проект здесь – это открытые сердца готовые служить и развивать те таланты которые вложил в них Господь.'
]

const aboutRef = ref(null)
const isRevealed = ref(false)
let observer = null

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isRevealed.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry || !entry.isIntersecting) {
        return
      }

      isRevealed.value = true
      observer.disconnect()
      observer = null
    },
    {
      threshold: 0.22
    }
  )

  if (aboutRef.value) {
    observer.observe(aboutRef.value)
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
    id="historyproect2"
    ref="aboutRef"
    class="about section-block"
    data-block-name="historyproect2"
    :class="{ 'is-revealed': isRevealed }"
  >
    <div class="container about-shell">
      <div class="about-stage">
        <div class="about-content">
          <div class="about-panel">
            <div class="about-copy">
              <h2 class="about-heading">
                О Давиде и идее
                <span class="accent-blue">проекта МГДИ</span>
              </h2>

              <div class="about-text">
                <p v-for="paragraph in aboutParagraphs" :key="paragraph">{{ paragraph }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="about-media-stack">
          <figure class="about-media about-david">
            <img class="about-media-image" :src="davidPhoto" alt="Давид, основатель проекта МГДИ" loading="lazy" />
          </figure>

          <figure class="about-media about-team">
            <img class="about-media-image" :src="teamPhoto" alt="Команда проекта МГДИ" loading="lazy" />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background:
    radial-gradient(circle at 12% 12%, rgba(191, 211, 90, 0.16), rgba(191, 211, 90, 0) 32%),
    radial-gradient(circle at 88% 84%, rgba(17, 70, 216, 0.12), rgba(17, 70, 216, 0) 40%),
    linear-gradient(180deg, #f7f5ef 0%, #f0ede5 100%);
}

.about-shell {
  position: relative;
}

.about-stage {
  margin-top: 8px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  align-items: start;
  gap: clamp(18px, 2vw, 28px);
}

.about-content {
  --about-strip-height: clamp(17px, 1.8vw, 24px);
  --about-portal-duration: 2.1s;
  --about-portal-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: visible;
  isolation: isolate;
}

.about-panel {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: clamp(20px, 2.2vw, 30px);
  border-radius: calc(var(--radius-lg) + 2px);
  border: 1px solid rgba(131, 153, 45, 0.16);
  background: rgba(201, 218, 116, 0.25);
  box-shadow:
    0 12px 26px rgba(7, 17, 44, 0.08),
    0 10px 24px rgba(131, 153, 45, 0.03);
  opacity: 0;
  clip-path: inset(48% 0 48% 0 round calc(var(--radius-lg) + 2px));
  transform: scaleY(0.78);
  transform-origin: center;
  transition:
    opacity calc(var(--about-portal-duration) * 0.9) var(--about-portal-ease),
    clip-path var(--about-portal-duration) var(--about-portal-ease),
    transform var(--about-portal-duration) var(--about-portal-ease),
    box-shadow calc(var(--about-portal-duration) * 0.9) ease;
  transition-delay: 0.05s;
}

.about-content::before,
.about-content::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 80%;
  height: var(--about-strip-height);
  border-radius: 999px;
  pointer-events: none;
  z-index: 2;
  opacity: 0.42;
  transform: translateX(-50%) scaleX(0.12);
  filter: blur(1.2px);
  background: rgba(17, 70, 216, 0.82);
  box-shadow:
    0 0 14px rgba(17, 70, 216, 0.34),
    0 0 32px rgba(17, 70, 216, 0.12);
  transition:
    top var(--about-portal-duration) var(--about-portal-ease),
    bottom var(--about-portal-duration) var(--about-portal-ease),
    transform var(--about-portal-duration) var(--about-portal-ease),
    opacity calc(var(--about-portal-duration) * 0.85) ease,
    filter calc(var(--about-portal-duration) * 0.9) var(--about-portal-ease),
    box-shadow calc(var(--about-portal-duration) * 0.9) ease;
}

.about-content::before {
  top: calc(50% - (var(--about-strip-height) / 2));
}

.about-content::after {
  bottom: calc(50% - (var(--about-strip-height) / 2));
}

.about-content > * {
  position: relative;
  z-index: 1;
}

.about-copy {
  position: relative;
  display: grid;
  gap: clamp(10px, 1.6vw, 18px);
  opacity: 0;
  transform: translateY(24px) scale(0.98);
  filter: blur(10px) saturate(1.08);
  transition:
    opacity var(--about-portal-duration) var(--about-portal-ease),
    transform var(--about-portal-duration) var(--about-portal-ease),
    filter calc(var(--about-portal-duration) * 0.85) var(--about-portal-ease);
  transition-delay: 0.16s;
}

.about-copy::before {
  content: '';
  position: absolute;
  inset: 14% -8% 16%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
  transform: scale(0.58);
  filter: blur(8px);
  background: radial-gradient(
    circle at 50% 50%,
    rgba(17, 70, 216, 0.34) 0%,
    rgba(17, 70, 216, 0.18) 32%,
    rgba(17, 70, 216, 0) 70%
  );
  transition:
    opacity calc(var(--about-portal-duration) * 0.8) ease,
    transform var(--about-portal-duration) var(--about-portal-ease),
    filter var(--about-portal-duration) var(--about-portal-ease);
}

.about-copy > * {
  position: relative;
  z-index: 1;
}

.about-heading {
  margin: 0;
  max-width: 16ch;
  text-transform: uppercase;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 0.98;
  font-size: clamp(2.15rem, 5.2vw, 4.8rem);
  color: var(--text-main);
  text-wrap: balance;
}

.about-text {
  display: grid;
  gap: 14px;
  max-width: 58ch;
}

.about-text p {
  margin: 0;
  color: var(--text-muted);
  font-size: clamp(0.96rem, 0.16vw + 0.9rem, 1.02rem);
  line-height: 1.62;
  overflow-wrap: anywhere;
  word-break: normal;
  hyphens: auto;
  text-wrap: pretty;
}

.about-text p:last-of-type {
  margin-bottom: 0;
}

.about-media-stack {
  display: grid;
  align-content: start;
  gap: clamp(12px, 1.4vw, 18px);
}

.about-media {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: var(--border-soft);
  opacity: 0;
  transform: translate3d(68px, 0, 0);
  transition:
    transform 1.9s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 1.9s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.36s ease;
}

.about-media-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-david {
  min-height: clamp(340px, 35vw, 480px);
  transition-delay: 0.08s;
}

.about-team {
  min-height: clamp(220px, 24vw, 320px);
  transition-delay: 0.42s;
}

.about-media:hover {
  transform: translate3d(0, -4px, 0);
  box-shadow: var(--shadow-pop);
}

.about-david .about-media-image {
  object-position: center 14%;
}

.about.is-revealed .about-content::before {
  top: calc(var(--about-strip-height) * -0.55);
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
  filter: blur(0);
  box-shadow:
    0 0 24px rgba(17, 70, 216, 0.44),
    0 0 50px rgba(17, 70, 216, 0.22);
}

.about.is-revealed .about-content::after {
  bottom: calc(var(--about-strip-height) * -0.55);
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
  filter: blur(0);
  box-shadow:
    0 0 24px rgba(17, 70, 216, 0.44),
    0 0 50px rgba(17, 70, 216, 0.22);
}

.about.is-revealed .about-panel {
  opacity: 1;
  clip-path: inset(0 0 0 0 round calc(var(--radius-lg) + 2px));
  transform: scaleY(1);
}

.about.is-revealed .about-copy {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0) saturate(1);
}

.about.is-revealed .about-copy::before {
  opacity: 0;
  transform: scale(1.35);
  filter: blur(18px);
}

.about.is-revealed .about-media {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@media (max-width: 1180px) {
  .about-stage {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.92fr);
  }
}

@media (max-width: 900px) {
  .about-stage {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 6px;
  }

  .about-content,
  .about-media-stack {
    max-width: 620px;
  }

  .about-content {
    --about-strip-height: 17px;
  }

  .about-panel {
    padding: 18px 16px;
  }

  .about-content::before,
  .about-content::after {
    width: 80%;
    height: var(--about-strip-height);
  }

  .about-david {
    min-height: 300px;
  }

  .about-team {
    min-height: 240px;
  }
}

@media (max-width: 640px) {
  .about-heading {
    max-width: 12ch;
  }

  .about-david {
    min-height: 248px;
  }

  .about-team {
    min-height: 210px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-panel,
  .about-copy,
  .about-media {
    opacity: 1;
    transform: none;
    transition: none;
    clip-path: inset(0 0 0 0 round calc(var(--radius-lg) + 2px));
  }

  .about-content::before,
  .about-content::after {
    transition: none;
    transform: translateX(-50%) scaleX(1);
    opacity: 1;
    filter: none;
  }

  .about-copy {
    filter: none;
    transform: none;
  }

  .about-copy::before {
    display: none;
  }
}
</style>
