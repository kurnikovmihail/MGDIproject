<script setup>
import SiteHeader from '../components/layout/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import PrivVideoSection from '../components/sections/PrivVideoSection.vue'
import Historyproect2Section from '../components/sections/Historyproect2Section.vue'
import ThreeDavvideoSection from '../components/sections/3davvideoSection.vue'
import WhySection from '../components/sections/WhySection.vue'
import Geogrf4Section from '../components/sections/4geogrfSection.vue'
import MomentsSection from '../components/sections/MomentsSection.vue'
import FinalSection from '../components/sections/FinalSection.vue'
import { useScrollEffects } from '../composables/useScrollEffects'
import {
  galleryCards,
  whyCards
} from '../data/homePageData'

const { isScrolled, parallaxShift } = useScrollEffects()
</script>

<template>
  <div class="site-shell">
    <SiteHeader :is-scrolled="isScrolled" />

    <main>
      <PrivVideoSection />
      <Historyproect2Section />
      <ThreeDavvideoSection />
      <WhySection :cards="whyCards" />
      <Geogrf4Section />
      <MomentsSection :cards="galleryCards" :parallax-shift="parallaxShift" />
      <FinalSection />
    </main>

    <SiteFooter />
  </div>
</template>
