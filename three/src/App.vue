<template>
  <Catalog head="List of Subject for Three.js" :subjects="routes" />
  <router-view v-if="$route.path !== '/'" class="root"></router-view>
</template>

<script setup>
import routes from "./routes/index";
import { Catalog } from "@digvan/c-v-3";
</script>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
}
</style>
