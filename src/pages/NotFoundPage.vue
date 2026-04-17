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
  background: var(--bg-milk);
}

.not-found .container {
  max-width: 56ch;
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
  line-height: 0.95;
  letter-spacing: -0.015em;
  font-size: clamp(2rem, 5vw, 3.4rem);
  text-wrap: balance;
}

p {
  margin: 0 0 22px;
  font-size: 1.02rem;
  line-height: 1.64;
  text-wrap: pretty;
  color: #3f475a;
}
</style>
