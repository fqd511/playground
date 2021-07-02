<template>
  <div :class="['container', isPin ? 'pin' : '']">
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

interface Output {
  subjects: any[];
  [attr: string]: any;
}

export default Vue.defineComponent({
  name: "Catalog",
  props: {
    isPin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props): Output {
    const subjects = routes;

    return { isPin: props.isPin, subjects };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  max-width: 600px;
  margin: auto;
  p {
    flex: 0 0 40px;
  }
  .subject-entrance-list {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
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
    transition: width 0.2s ease-in, bottom 0.2s ease-in, top 0.2s ease-in,
      border 0.2s ease-in;
    background-color: #ffffff99;

    &:hover {
      bottom: unset;
      top: 0;
      border-color: transparent;
      transition: width 0.2s ease-out, bottom 0.2s ease-out, top 0.2s ease-out,
        border 0.2s ease-out;
    }
  }
}
</style>
