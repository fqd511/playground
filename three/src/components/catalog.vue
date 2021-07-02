<template>
  <div class="container">
    <p>List of Subject for Three.js</p>
    <div class="subject-entrance-list">
      <router-link v-for="item in subjects" :key="item.path" :to="item.path">{{
        item.label
      }}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import * as Vue from "vue";
import routes from "../routes/index";
export default Vue.defineComponent({
  name: "Catalog",
  props: {
    isPin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const subjects = routes;

    return {};
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: columns nowrap;
  align-items: stretch;
  max-width: 600px;
  margin: auto;
  p {
    flex: 0 0 40px;
  }
  .subject-entrance-list {
    display: flex;
    align-items: center;
    a {
      margin: 1em;
    }
  }
  &.pin {
    width: 120px;
    position: absolute;
    left: 2em;
    bottom: calc(100vh - 5px);
    border-bottom: 5px grey solid;
    border-radius: 5px;
    transition: all 0.2s ease-in;
    &:hover {
      bottom: unset;
      top: 0;
      border-color: transparent;
      transition: all 0.2s ease-out;
    }
  }
}
</style>
