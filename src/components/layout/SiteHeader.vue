<script setup>
import logoHeader from '../../assets/layout/01-logo-header.png'
</script>

<template>
  <header class="site-header">
    <div class="container header-grid">
      <a class="logo" href="#priv-video" aria-label="МГДИ">
        <img :src="logoHeader" alt="Логотип МГДИ" class="logo-image" />
      </a>

      <a class="header-cta" href="#final">Вступить</a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: absolute;
  inset: 0 0 auto;
  width: 100%;
  z-index: 30;
  padding: 12px 0 10px;
}

.header-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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

.header-cta {
  min-width: 176px;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

@media (max-width: 900px) {
  .site-header {
    padding: 8px 0;
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

  .header-cta {
    margin-right: -8px;
    min-width: auto;
    min-height: 42px;
    padding: 8px 16px;
    font-size: 0.72rem;
  }
}

@media (max-width: 640px) {
  .site-header {
    padding: 6px 0;
  }

  .logo {
    width: 128px;
    height: 56px;
    margin-left: -6px;
  }

  .logo-image {
    width: 120px;
    transform: translateY(-20px);
  }

  .header-cta {
    padding: 8px 12px;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
  }
}

@media (hover: none) {
  .header-cta:hover {
    transform: none;
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.64);
  }
}
</style>
