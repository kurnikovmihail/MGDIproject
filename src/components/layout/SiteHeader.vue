<script setup>
import logoHeader from '../../assets/layout/01-logo-header.png'

defineProps({
  isScrolled: {
    type: Boolean,
    default: false
  }
})

const navItems = [
  { href: '#historyproect2', label: 'О проекте' },
  { href: '#3davvideo', label: 'Служение' },
  { href: '#4geogrf', label: 'Города' },
  { href: '#moments', label: 'Моменты' }
]
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header-grid">
      <a class="logo" href="#priv-video" aria-label="МГДИ">
        <img :src="logoHeader" alt="Логотип МГДИ" class="logo-image" />
      </a>

      <nav class="main-nav">
        <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>

      <a class="header-cta" href="#final">Вступить</a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  padding: 12px 0 10px;
  transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
}

.site-header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(191, 211, 90, 0), rgba(191, 211, 90, 0.22), rgba(255, 98, 51, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.site-header.is-scrolled {
  background: rgba(5, 10, 26, 0.62);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.site-header.is-scrolled::after {
  opacity: 1;
}

.header-grid {
  display: grid;
  grid-template-columns: minmax(176px, 214px) 1fr minmax(176px, 214px);
  align-items: center;
  gap: 24px;
}

.logo {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  height: 74px;
  width: 176px;
  overflow: hidden;
  margin-left: -12px;
}

.logo-image {
  position: relative;
  width: min(168px, 100%);
  height: auto;
  display: block;
  transform: translateY(-26px);
  filter: brightness(0) invert(1);
  opacity: 0.96;
}

.main-nav {
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0;
  border-radius: 0;
  background: none;
  border: none;
  box-shadow: none;
  outline: none;
  backdrop-filter: none;
}

.main-nav a {
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
  font-size: 0.82rem;
  line-height: 1.25;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.25s ease;
}

.main-nav a:hover {
  color: var(--accent-lime);
}

.header-cta {
  justify-self: end;
  min-width: 176px;
  text-align: center;
  padding: 11px 19px;
  border: 1px solid rgba(255, 255, 255, 0.64);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  margin-right: -12px;
  color: rgba(255, 255, 255, 0.96);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
}

.header-cta:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .header-grid {
    grid-template-columns: minmax(150px, 190px) 1fr minmax(150px, 190px);
  }

  .main-nav {
    gap: 14px;
    padding: 0;
  }
}

@media (max-width: 900px) {
  .site-header {
    padding: 8px 0;
  }

  .header-grid {
    grid-template-columns: auto auto;
    justify-content: space-between;
    gap: 12px;
  }

  .logo {
    height: 62px;
    width: 142px;
    margin-left: -8px;
  }

  .logo-image {
    width: 136px;
    transform: translateY(-22px);
  }

  .main-nav {
    order: 3;
    position: static;
    grid-column: span 2;
    justify-content: flex-start;
    overflow-x: auto;
    padding: 6px 0 6px;
    border: none;
    border-radius: 0;
    background: none;
    backdrop-filter: none;
  }

  .main-nav a {
    white-space: nowrap;
    font-size: 0.76rem;
  }

  .header-cta {
    margin-right: -8px;
    min-width: auto;
    padding: 8px 14px;
    font-size: 0.72rem;
  }
}
</style>
