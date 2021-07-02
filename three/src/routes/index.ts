import Scene from "../pages/scene/index.vue";
import Catalog from '../components/catalog.vue'
export default [
  { path: "/scene", component: Scene, label: "场景图" },
  { path: "/", component: Catalog, label: "目录页" },
];
