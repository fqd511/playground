export default [
  {
    path: "/",
    component: () => import("../components/Catalog.vue"),
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
