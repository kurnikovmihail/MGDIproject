<script setup>
import SiteHeader from '../components/layout/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import PrivVideoSection from '../components/sections/01PrivVideoSection.vue'
import Historyproect2Section from '../components/sections/02Historyproect2Section.vue'
import ThreeDavvideoSection from '../components/sections/03DavvideoSection.vue'
import Geogrf4Section from '../components/sections/04GeogrfSection.vue'
import MomentsSection from '../components/sections/05MomentsSection.vue'
import FinalSection from '../components/sections/06FinalSection.vue'
import {
  whyCards
} from '../data/homePageData'
</script>

<template>
  <div class="site-shell">
    <SiteHeader />

    <main>
      <PrivVideoSection />
      <Historyproect2Section />
      <ThreeDavvideoSection :cards="whyCards" />
      <Geogrf4Section />
      <MomentsSection />
      <FinalSection />
    </main>

    <SiteFooter />
  </div>
</template>
