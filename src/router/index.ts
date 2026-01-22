import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 換頁時滾動至頂部
router.afterEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    window.scrollTo(0, 0);
  }
);

export default router;
