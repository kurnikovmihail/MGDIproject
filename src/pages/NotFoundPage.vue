<template>
  <main class="not-found">
    <div class="container">
      <p class="not-found-code">404</p>
      <h1>Страница не найдена</h1>
      <p>Похоже, такого адреса нет. Вернитесь на главную.</p>
      <a class="btn btn-primary" href="/">На главную</a>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100svh;
  display: grid;
  place-items: center;
  text-align: center;
  background: var(--bg-warm);
}

.not-found-code {
  margin: 0;
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
}

h1 {
  margin: 10px 0;
  font-family: 'Dela Gothic One', sans-serif;
  font-weight: 400;
  font-size: clamp(2rem, 5vw, 3.4rem);
}

p {
  margin: 0 0 22px;
  color: #3f475a;
}
</style>
