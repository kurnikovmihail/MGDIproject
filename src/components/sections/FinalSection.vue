<template>
  <section id="final" class="final section-block">
    <div class="container final-shell">
      <p class="section-kicker">Финал</p>
      <h2 class="final-title">
        Присоединяйся к движению.
        <span class="accent-lime">Служим Богу</span>
        вместе.
      </h2>
      <p class="final-text">
        Мы открыты для участников, наставников и партнеров. Если хотите запускать идеи,
        которые несут пользу людям и городу, вы в правильном месте.
      </p>
      <div class="final-actions">
        <a class="btn btn-primary" href="#">Подать заявку</a>
        <a class="btn btn-secondary" href="#">Стать партнером</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final {
  position: relative;
  overflow: hidden;
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
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 100%);
  background-size: 120px 120px;
  opacity: 0.25;
}

.final-shell {
  position: relative;
  z-index: 1;
}

.final-title {
  margin: 0;
  max-width: 960px;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 0.94;
  text-transform: uppercase;
  font-size: clamp(2.1rem, 6vw, 5.1rem);
}

.final-text {
  margin: 18px 0 30px;
  max-width: 680px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 1.02rem;
  line-height: 1.56;
}

.final-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .final-text {
    margin-bottom: 24px;
  }
}
</style>
