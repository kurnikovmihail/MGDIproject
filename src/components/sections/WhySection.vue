<script setup>
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
        <span class="accent-lime">город меняется</span>
      </h2>
      <p class="why-text">
        Здесь люди служат Богу через конкретные дела, и каждый шаг превращается в реальную пользу для других.
      </p>

      <div class="grid-12 why-grid">
        <article v-for="(card, index) in cards" :key="card.title" class="why-card col-3">
          <span class="why-index">0{{ index + 1 }}</span>
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
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
  align-items: stretch;
}

.why-card {
  position: relative;
  min-height: 188px;
  border-radius: var(--radius-md);
  padding: 20px 20px 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  overflow: hidden;
  transition: transform 0.26s ease, background 0.26s ease;
}

.why-card::after {
  content: '';
  position: absolute;
  inset: auto -20% -48px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid rgba(191, 211, 90, 0.2);
  opacity: 0.7;
}

.why-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.why-index {
  display: inline-flex;
  margin-bottom: 10px;
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 1.25rem;
  letter-spacing: 0.04em;
  color: rgba(191, 211, 90, 0.94);
}

.why-card h3 {
  margin: 0 0 10px;
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 1.06rem;
  font-weight: 400;
}

.why-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.93rem;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .why-card {
    min-height: auto;
  }
}
</style>
