<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import teamPhoto from '../../assets/hero-cover.jpg'
import davidPhoto from '../../assets/david-portrait.jpg'

const aboutParagraphs = [
  'Привет. Я Давид, и МГДИ появился из простой идеи: дать ребятам пространство, где они могут полностью посвятить себя и свое время для духовной роста и практики.',
  'Молодежный год для Иисуса это решение которые способно изменить твою жизнь. Множество различных служений, возможность пройти обучение в библейской школе, а так же потом применить это все на практике.',
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
      <p class="section-kicker dark">О проекте</p>

      <h2 class="about-heading">
        О Давиде и идее
        <span class="accent-blue">проекта МГДИ</span>
      </h2>

      <div class="about-stage">
        <figure class="about-media about-team g-frame-sm">
          <img :src="teamPhoto" alt="Команда проекта МГДИ" loading="lazy" />
          <figcaption>Команда МГДИ</figcaption>
        </figure>

        <div class="about-text">
          <p v-for="paragraph in aboutParagraphs" :key="paragraph">{{ paragraph }}</p>
          <a class="btn btn-primary btn-small about-link" href="#why">Наша история</a>
        </div>

        <figure class="about-media about-david g-frame-sm">
          <img :src="davidPhoto" alt="Давид, основатель проекта МГДИ" loading="lazy" />
          <figcaption>Давид, основатель</figcaption>
        </figure>
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

.about-heading {
  margin: 0;
  max-width: 920px;
  text-transform: uppercase;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 0.98;
  font-size: clamp(2.15rem, 5.2vw, 4.8rem);
  color: var(--text-main);
}

.about-stage {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: start;
  gap: var(--gutter-desktop);
}

.about-text {
  grid-column: 5 / span 4;
  align-self: start;
  max-width: 610px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.56s ease, transform 0.56s ease;
}

.about-text p {
  margin: 0 0 14px;
  color: var(--text-muted);
  font-size: 1.01rem;
  line-height: 1.6;
}

.about-text p:last-of-type {
  margin-bottom: 22px;
}

.about-link {
  min-width: 206px;
}

.about-media {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: var(--border-soft);
  opacity: 0;
  transition: transform 0.9s ease-out, opacity 0.9s ease-out, box-shadow 0.28s ease;
}

.about-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-media:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-pop);
}

.about-media figcaption {
  position: absolute;
  left: 14px;
  bottom: 12px;
  z-index: 3;
  margin: 0;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.96);
  background: rgba(6, 11, 24, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.about-team {
  grid-column: 1 / span 4;
  align-self: start;
  height: 336px;
  transform: translateX(-52px);
}

.about-david {
  grid-column: 10 / span 3;
  align-self: start;
  height: 332px;
  transform: translateX(58px);
  transition-delay: 0.18s;
}

.about-david img {
  object-position: center 16%;
}

.about.is-revealed .about-text {
  opacity: 1;
  transform: translateY(0);
}

.about.is-revealed .about-team,
.about.is-revealed .about-david {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 1180px) {
  .about-team {
    height: 296px;
  }

  .about-david {
    height: 292px;
  }
}

@media (max-width: 900px) {
  .about-stage {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
  }

  .about-david,
  .about-text,
  .about-team {
    width: 100%;
    max-width: 560px;
    margin: 0;
    transform: translateY(22px);
  }

  .about-david {
    order: 1;
    height: 230px;
  }

  .about-text {
    order: 2;
  }

  .about-team {
    order: 3;
    height: 264px;
  }

  .about.is-revealed .about-david,
  .about.is-revealed .about-text,
  .about.is-revealed .about-team {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-text,
  .about-media {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
