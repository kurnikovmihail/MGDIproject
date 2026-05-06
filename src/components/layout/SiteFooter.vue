<script setup>
const menuLinks = [
  { href: '#historyproect2', label: 'О проекте' },
  { href: '#3davvideo', label: 'Служение' },
  { href: '#4geogrf', label: 'Города' },
  { href: '#moments', label: 'Галерея' }
]

const socialLinks = [
  { href: 'https://vk.ru/mgdiperm', label: 'VK' },
  { href: 'https://t.me/mgdiperm', label: 'Telegram' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <p class="footer-title">МГДИ</p>
        <p class="footer-muted">Молодежное служение, где вера становится действием.</p>
      </div>

      <div class="footer-col">
        <h4>Меню</h4>
        <div class="footer-links">
          <a v-for="item in menuLinks" :key="item.label" :href="item.href">{{ item.label }}</a>
        </div>
      </div>

      <div class="footer-col">
        <h4>Соцсети</h4>
        <div class="footer-links">
          <a v-for="item in socialLinks" :key="item.label" :href="item.href" target="_blank" rel="noopener noreferrer">
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 22%, rgba(191, 211, 90, 0.16), rgba(191, 211, 90, 0) 30%),
    radial-gradient(circle at 82% 78%, rgba(255, 98, 51, 0.14), rgba(255, 98, 51, 0) 32%),
    linear-gradient(155deg, #020713 0%, #061233 46%, #020714 100%);
  color: rgba(255, 255, 255, 0.84);
  padding: 44px 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.footer-brand {
  position: relative;
  padding-right: 18px;
}

.footer-brand::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 96px;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-lime), rgba(191, 211, 90, 0));
}

.footer-title {
  margin: 0 0 10px;
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 1.45rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer-muted {
  margin: 0;
  max-width: 280px;
  font-size: 1rem;
  line-height: 1.62;
  text-wrap: pretty;
  color: rgba(255, 255, 255, 0.72);
}

.footer-col h4 {
  margin: 0 0 12px;
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.footer-links {
  display: grid;
  gap: 9px;
}

.footer-links a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  width: fit-content;
  font-size: 0.96rem;
  line-height: 1.38;
  color: rgba(255, 255, 255, 0.84);
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--accent-lime);
}

@media (max-width: 900px) {
  .site-footer {
    padding: 34px 0;
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 16px;
  }

  .footer-brand {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .site-footer {
    padding: 30px 0;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .footer-brand {
    grid-column: auto;
    padding-right: 0;
  }

  .footer-muted {
    font-size: 0.92rem;
    line-height: 1.54;
  }

  .footer-col h4 {
    margin-bottom: 8px;
    font-size: 0.7rem;
  }

  .footer-links {
    gap: 6px;
  }

  .footer-links a {
    font-size: 0.9rem;
    min-height: 38px;
  }
}

@media (hover: none) {
  .footer-links a:hover {
    color: rgba(255, 255, 255, 0.84);
  }
}
</style>
