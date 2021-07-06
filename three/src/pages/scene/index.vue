/** * By 511 at 21/07/02/ 周五 11:39 * @Desc: three.js sence demo */
<template>
  <div>
    <canvas id="canvas"></canvas>
    <div id="info"></div>
  </div>
</template>

<script>
import * as THREE from "three";
function init() {
  /** canvas dom */
  const canvasDom = document.querySelector("#canvas");

  if (!canvasDom) return;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasDom,
  });
  renderer.setClearColor(0xaaaaaa);
  renderer.shadowMap.enabled = true;
}
export default {
  created() {
    init();
  },
};
</script>

<style lang="scss" scoped>
#canvas {
  width: 100%;
  height: 100%;
  display: block;
}
#info {
  position: absolute;
  left: 1em;
  top: 1em;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5em;
  color: white;
  font-family: monospace;
}
</style>
