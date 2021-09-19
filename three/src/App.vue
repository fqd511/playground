<template>
  <Catalog head="List of Subject for Three.js" :subjects="routes" />
  <router-view v-if="$route.path !== '/'" class="root"></router-view>
</template>

<script lang="ts" setup>
import routes from "./routes/index";
</script>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
}
</style>
