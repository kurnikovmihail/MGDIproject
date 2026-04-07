<script setup>
import guitarCard from '../../assets/карточка гитара.png'
import communicationCard from '../../assets/карточка общение.png'
import learningCard from '../../assets/карточка обучение.png'
import tripsCard from '../../assets/карточка поездки.png'

const iconSet = [guitarCard, communicationCard, learningCard, tripsCard]

defineProps({
  cards: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section id="why" class="why section-block">
    <div class="container">
      <p class="section-kicker">Почему это круто</p>
      <h2 class="why-statement">
        Когда вера встречается с действием,
      </h2>
      <p class="why-text">
        Здесь полностью менятеся твоя жизнь
      </p>

      <div class="grid-12 why-grid">
        <article v-for="(card, index) in cards" :key="card.title" class="why-card col-3">
          <p class="why-top">{{ card.title }}</p>

          <div class="why-icon-shell" aria-hidden="true">
            <img class="why-icon" :src="iconSet[index % iconSet.length]" alt="" />
          </div>

          <p class="why-bottom">{{ card.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why {
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 72%, rgba(191, 211, 90, 0.09), rgba(191, 211, 90, 0) 34%),
    radial-gradient(circle at 84% 78%, rgba(255, 98, 51, 0.08), rgba(255, 98, 51, 0) 35%),
    linear-gradient(162deg, #06163f 0%, #081c4a 52%, #03091e 100%);
  color: var(--white);
}

.why-statement {
  margin: 0;
  max-width: 1080px;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 0.94;
  text-transform: uppercase;
  font-size: clamp(2.2rem, 6vw, 5.5rem);
}

.why-text {
  margin: 20px 0 36px;
  max-width: 760px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.03rem;
  line-height: 1.55;
}

.why-grid {
  align-items: start;
}

.why-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 0 8px;
}

.why-top {
  margin: 0;
  min-height: 2.5em;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
}

.why-icon-shell {
  width: min(100%, 150px);
  aspect-ratio: 1 / 1;
}

.why-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.why-bottom {
  margin: 0;
  min-height: 4.4em;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.86rem;
  line-height: 1.45;
}

@media (max-width: 900px) {
  .why-top {
    min-height: auto;
  }

  .why-icon-shell {
    width: min(100%, 136px);
  }

  .why-bottom {
    min-height: auto;
  }
}
</style>
