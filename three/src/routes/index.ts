export default [
  {
    path: "/",
    component: () => import("../App.vue"),
    name: "Catalog",
    label: "目录页",
  },
  {
    path: "/scene",
    component: () => import("../pages/scene/index.vue"),
    name: "Scene",
    label: "场景图",
  },
];
