<script setup>
import {onMounted} from "vue";

import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutFixed from './components/LayoutFixed.vue'

</script>

<template>

  <LayoutFixed />
  <LayoutNav />
  <LayoutHeader />
  <!--  二级路由出口  -->
  <RouterView />
  <LayoutFooter />

</template>

<style scoped>

</style>
