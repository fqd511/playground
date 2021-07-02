export default [
  {
    path: "/scene",
    component: () => import("../pages/scene/index.vue"),
    name: "Scene",
    label: "场景图",
  },
  {
    path: "/",
    component: () => import("../components/Catalog.vue"),
    name: "Catalog",
    label: "目录页",
  },
];
